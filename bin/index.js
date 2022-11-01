#!/usr/bin/env node

let inputfile = process.argv[2];
let changesfile = process.argv[3];
let outputfile = process.argv[4];

var fs = require("fs");

const readinputfilesData = fs.readFileSync(inputfile, "utf8");
const readChangesfilesData = fs.readFileSync(changesfile, "utf8");

let inputfileData = JSON.parse(readinputfilesData);
const changesFileData = JSON.parse(readChangesfilesData);

function compare(inputfileData, changesFileData) {
  // we are adding existing song to an existing playlist
  let playlistData = inputfileData.playlists;
  let songsData = inputfileData.songs;

  for (let i = 0; i < changesFileData.add_song.length; i++) {
    let index = playlistData.findIndex(
      (item) => item.id == changesFileData.add_song[i].playlist_id
    );
    console.log(index,"index")
    //  checking  if song exists or not
    let checkIfSongIndexExists = songsData.findIndex(
      (item) => item.id == changesFileData.add_song[i].song_id
    );

    if (index != -1 && checkIfSongIndexExists != -1) {
      let tempSongsList = [...playlistData[index].song_ids];
      tempSongsList.push(changesFileData.add_song[i].song_id);
      playlistData[index].song_ids = tempSongsList;
    }
  }
  // we are adding new playlist for existing user
  for (let i = 0; i < changesFileData.add_playlist.length; i++) {
    let newId = Number(playlistData[playlistData.length - 1].id) + 1;
    playlistData.push({
      id: newId.toString(),
      owner_id: changesFileData.add_playlist[i].owner_id,
      song_ids: changesFileData.add_playlist[i].song_ids,
    });
  }
  // removing playlist
  let tempPlaylistData = [...playlistData];
  for (let i = 0; i < changesFileData.remove_playlist.length; i++) {
    tempPlaylistData = tempPlaylistData.filter(
      (item) => item.id != changesFileData.remove_playlist[i]
    );
  }
  playlistData = [...tempPlaylistData];
  // let tmpData = inputfileData
  inputfileData.playlists = [...playlistData];

  fs.writeFileSync(outputfile, JSON.stringify(inputfileData));
}

compare(inputfileData, changesFileData);
