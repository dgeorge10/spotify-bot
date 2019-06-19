const Discord = require("discord.js");
const SpotifyWebApi = require("spotify-web-api-node");
const client = new Discord.Client();
const auth = require("./auth/auth.js");

let spotify = new SpotifyWebApi({
  clientId: auth.spotify.clientId,
  clientSecret: auth.spotify.clientSecret,
  redirectUri: auth.spotify.redirectUri
});

spotify
  .clientCredentialsGrant()
  .then(data => {
    console.log("The access token is " + data.body["access_token"]);
    spotify.setAccessToken(data.body["access_token"]);
  })
  .catch(err => {
    console.log("Something went wrong!", err);
  });


client.on("message", msg => {
  let { content } = msg;

  if (content.startsWith("!")) {

    let inputted = content.substring(1)
    let cmd = inputted.split(" ")[0];

    console.log(`command recognized: ${cmd}`);

    switch (cmd) {
      case "list":
        console.log("list command executed");
        return;
      case "add":
        console.log("add command executed");
        return;
      case "search":
        console.log("search command executed");
        let song = inputted.substr(inputted.indexOf(" ") + 1);
        console.log(`searching for song: ${song} `)
        searchSong(song)
        return;
      case "temp":
        console.log("temp command executed");
        return;
    }
  } else {
    console.log("not a command found: " + content);
  }
});

function sendMessage(msg) {
    client.channels.get("590716056042078221").send(msg)
}

function searchSong(song) {
    spotify.searchTracks('track:'+ song, {limit: 3}).then(data => {
        let resp = data.body.tracks.items;
        if(resp.length !== 0) {
            resp.forEach(item => {
                let link = item.external_urls.spotify
                sendMessage(link)
            })
        } else {
            sendMessage("Beep boop. Nothing found. Try again. Boop Beep.")
        }
    }).catch(err => console.log(err))

}
client.login(auth.discord.secret);
