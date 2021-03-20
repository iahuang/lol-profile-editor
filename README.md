# lol-profile-editor

LoL Profile Editor is a tool that uses Riot Games' [LCU API](https://riot-api-libraries.readthedocs.io/en/latest/lcu.html) to customize your profile beyond what is usually allowed by the client.

![Screenshot](https://github.com/iahuang/lol-profile-editor/raw/main/assets/screenshot.png)

## Usage

### Building
```bash
> npm install
> tsc --project server
> tsc --project client
> npm start
```

### Setup
- Configure `config.json` as directed by the server output
- Open the League client
- Navigate to http://localhost:8080 (or a different port if specified)

## Known Limitations
- LoL Profile Editor does not currently work on Mac OS X
- Not all custom profile icons work properly
- LoL Profile Editor supports WSL, although you may encounter issues if using WSL2