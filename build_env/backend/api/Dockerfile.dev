FROM python:3.10-slim-buster

WORKDIR /app

COPY ./backend/api/requirements.txt ./

RUN pip install -r requirements.txt

COPY ./backend/api .

EXPOSE 4000

CMD [ "flask", "run", "--host=0.0.0.0", "--port=4000"]
