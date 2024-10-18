# AI Pothole Detection Apps (Backend, mobile app and web app)

how to clone  the project
```sh
git clone https://github.com/Aris-ngoy/POTHOLE_APP.git
cd POTHOLE_APP

```

```
|-- apps
    |-- backend -> Nextjs backend
    |-- mobile -> React Native App
    |-- process -> Flask App -> AI process server
```

install dependencies
```sh
pnpm install
```

Run the following command:

```sh
pnpm dev:web 
pnpm dev:mobile
```

# Flask App
install dependencies
```sh
cd app/process

python3.10 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# flask --app app run   
```

to run the flask app
```sh
cd app/process
source .venv/bin/activate
gunicorn --timeout 120 app:app 
```

