import json
from flask import Flask, redirect

app = Flask(__name__, static_url_path='', static_folder='build')
my_json = json.load(open('data.json'))


@app.route('/data')
def data():
    return json.dumps(my_json)


@app.route('/')
def index():
    return redirect('/index.html')


if __name__ == '__main__':
    app.run(host='localhost', port=5000)
