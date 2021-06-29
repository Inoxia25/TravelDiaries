# [TravelDiaries](https://github.com/Inoxia25/TravelDiaries/)
A web app that allows users to share their travel experiences and listen to music based on their travel mood.

## Demo link
https://travel-diariess.herokuapp.com/

## What it Does
- Allows users to signup/login.
- Allows users to add/edit/delete travel experiences by adding title, image link, cost per night and description of the experience.
- Allows other users to comment on the travel experiences, and edit/delete their comments later.
- Shows a travel playlist with all the songs for your travel!
- Allows you to choose your travel mood (like hiking, going on a road trip,etc) and relevant songs are recommended using Spotify after authentication using Spotify is done.

## How to start ? 🎪
- If you don't have git on your machine, [install](https://docs.github.com/en/github/getting-started-with-github/set-up-git) it.

## Fork this repository 🚀
- Fork this repository by clicking on the fork button on the top of this page. This will create a copy of this repository in your account.

## Clone the repository 🏁
Now clone the forked repository to your machine. Go to your GitHub account, open the forked repository, click on the code button and then click the copy to clipboard icon.

Open a terminal and run the following git command:

`git clone "url you just copied"`
where "url you just copied" (without the quotation marks) is the url to this repository (your fork of this project). See the previous steps to obtain the url.

For example:

`git clone https://github.com/Inoxia25/TravelDiaries/`

## How to run ? 🛴
After cloning the repo
- Run `npm install` in the terminal.
- Install dependencies
- Run `npm install -g nodemon` (optional, but recommended)
- Move on and run `node app.js`
- This will start the project automatically on `localhost:3000`.

## Technologies Used
- Front end languages: HTML5, CSS3, Javascript
- Front end framework: Bootstrap to design the user interface (UI)
- Backend: Node.js, Express.js
- Authentication done using Passport.js.
- MongoDB is used as a database to store user data.
- Spotify API: To fetch and manage the relevant catalogs about artists, tracks and playlists.  
- 'Connect-flash' used to render success and error messages


