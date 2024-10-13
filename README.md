# AI Pothole Detection Apps (Backend, mobile app and web app)

|-- apps
    |-- backend -> Nextjs backend
    |-- mobile -> React Native App
    |-- process -> Flask App -> AI process server



Run the following command:

```sh
pnpm dev:web 
pnpm dev:mobile
```

# Flask App
```sh
cd app/process

python3.10 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

flask --app app run   
```

