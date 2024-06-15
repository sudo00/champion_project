from os import environ
from flask_cors import CORS  
from flask import Flask, request, jsonify, redirect, url_for, send_file
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from jwt import encode, decode  # Импорт функций из модулей 
import datetime
from functools import wraps
import pika
import json
from minio import Minio

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DATABASE_URL')
app.config['SECRET_KEY'] = 'your_secret_key'  # Замените на свой секретный ключ
app.config['JWT_EXPIRATION_DELTA'] = datetime.timedelta(minutes=30)  # Время жизни токена
db = SQLAlchemy(app)

client = Minio(environ.get('S3_ENDPOINT'), environ.get('S3_ACCESS_KEY'), environ.get('S3_SECRET_KEY'), secure=False)
bucket = environ.get('S3_BUCKET_NAME')
if False == client.bucket_exists(bucket):
    client.make_bucket(bucket)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username

STATUS_CREATED = 'created'
STATUS_IN_PROGRESS = 'in_progress'
STATUS_DONE = 'done'

class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(255), nullable=False)
    object_name = db.Column(db.String(255), nullable=True)

    @property
    def serialize(self):
       return {
           'id'         : self.id,
           'status'  : self.status,
           'object_name'  : self.object_name
       }

    def __repr__(self):
        return '<History %r>' % self.object_name

with app.app_context():
    db.create_all()

def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = None
        try:
            if 'Authorization' in request.headers:
                token = request.headers['Authorization'].split(" ")[1]
            if not token:
                return jsonify({'message': 'Token is missing!'}), 401
            data = decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.filter_by(id=data['id']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return func(current_user, *args, **kwargs)
    return decorated

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not 'username' in data or not 'password' in data:
        return jsonify({'message': 'Missing username or password'}), 400
    username = data['username']
    password = data['password']
    hashed_password = generate_password_hash(password)
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    token = encode({'id': new_user.id, 'exp': datetime.datetime.utcnow() + app.config['JWT_EXPIRATION_DELTA']}, app.config['SECRET_KEY'], algorithm='HS256')
    return jsonify({'token': token}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not 'username' in data or not 'password' in data:
        return jsonify({'message': 'Missing username or password'}), 400
    username = data['username']
    password = data['password']
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid credentials'}), 401
    token = encode({'id': user.id, 'exp': datetime.datetime.utcnow() + app.config['JWT_EXPIRATION_DELTA']}, app.config['SECRET_KEY'], algorithm='HS256')
    return jsonify({'token': token}), 200

@app.route('/generate', methods=['POST'])
@token_required
def generate(current_user):
    postData = request.get_json()
    if not postData or not 'type' in postData or not 'options' in postData:
        return jsonify({'error': 'Missing image parameters'}), 400
    
    typeOfGenerate = postData['type']
    optionsOfGenerate = postData['options']
    valid = True
    if 'image' == typeOfGenerate:
        if not optionsOfGenerate or not 'width' in optionsOfGenerate or not 'height' in optionsOfGenerate or not 'count' in optionsOfGenerate or not 'product_type' in optionsOfGenerate or not 'positive_prompt' in optionsOfGenerate or not 'negative_prompt' in optionsOfGenerate or not 'offer' in optionsOfGenerate:
            valid = False
    elif 'banner' == typeOfGenerate:
        if not optionsOfGenerate or not 'type' in optionsOfGenerate or not 'position' in optionsOfGenerate or not 'color' in optionsOfGenerate or not 'image_id' in optionsOfGenerate:
            valid = False
    elif 'inpaint' == typeOfGenerate:
        if not 'image_id' in optionsOfGenerate or not 'mask' in optionsOfGenerate or not 'positive_prompt' in optionsOfGenerate or not 'negative_prompt' in optionsOfGenerate:
            valid = False

    if False == valid:
        return jsonify({'error': 'Missing banner parameters'}), 400

    historyIds = []
    if 'image' == typeOfGenerate:
        for i in range(int(optionsOfGenerate["count"])):
            history = History(user_id=current_user.id, status=STATUS_CREATED)
            db.session.add(history)
            db.session.commit()
            historyIds.append({"id": history.id})
    if 'banner' == typeOfGenerate:
        history = History(user_id=current_user.id, status=STATUS_CREATED)
        db.session.add(history)
        db.session.commit()
        historyIds.append({"id": history.id})
    if 'inpaint' == typeOfGenerate:
        history = History(user_id=current_user.id, status=STATUS_CREATED)
        db.session.add(history)
        db.session.commit()
        historyIds.append({"id": history.id})
            
    body = {}
    body['options'] = optionsOfGenerate
    body['type'] = typeOfGenerate
    body['user_id'] = current_user.id
    body['history_ids'] = historyIds
    credentials = pika.PlainCredentials('user', 'password')
    parameters = pika.ConnectionParameters('rabbitmq', 5672, '/', credentials)
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()
    channel.queue_declare(queue='generate')
    channel.basic_publish(exchange='', routing_key="generate", body=json.dumps(body))
    connection.close()
    
    return jsonify(historyIds), 200

import sys
@app.route('/history', methods=['GET'])
@token_required
def history(current_user):
    print(current_user, file=sys.stderr)
    id_get = request.args.getlist('id')
    if id_get:
        history = History.query.filter(History.user_id == current_user.id, History.id.in_(id_get)).all()
    else:
        history = History.query.filter(History.user_id == current_user.id).all()
    return jsonify(json_list=[i.serialize for i in history]), 200

import io
@app.route('/image/<object_name>', methods=['GET'])
@token_required
def getImage(current_user, object_name):
    try:
        assert object_name == request.view_args['object_name']
        response = client.get_object(bucket_name=bucket, object_name=object_name)

        # Создаем BytesIO объект для хранения изображения
        image_stream = io.BytesIO(response.data)

        # Отправляем изображение в ответ на HTTP-запрос
        return send_file(image_stream, mimetype='image/png')
    except Exception as e:
        # Обработка ошибок
        return 'Ошибка при получении изображения: {}'.format(e), 500

if __name__ == '__main__':
    app.run(debug=True)
    