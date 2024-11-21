from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
CORS(app)  # Enables CORS for all routes
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow all origins for Socket.IO

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)

@socketio.on('message')
def handle_message(data):
    emit('message', data, broadcast=True)

@socketio.on('typing')
def handle_typing(data):
    emit('typing', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
