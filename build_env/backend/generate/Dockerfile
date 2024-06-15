FROM python:3.10-slim-buster

WORKDIR /app

COPY ./backend/generate/requirements.txt ./

RUN pip install -r requirements.txt

COPY ./backend/generate .

CMD ["python", "main.py"]
