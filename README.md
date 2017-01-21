# Image Search Microservice

This api was created for the FreeCodeCamp exercice "Image Search Abstraction Layer"

* [FreeCodeCamp] - Link to the exercice
* [Heroku] - Online deployed version

### API description

The API allows thew search for image files by title (allowing the definition of the offset) using the BING image search API.
This API also stores each search and allows for the viewing of the last search requests.

  - **Use-case 1:** User can get the image URLs, alt text and page urls for a set of images relating to a given search string.
  - **Use-case 2:** User can paginate through the responses by adding a ?offset=2 parameter to the URL.
  - **Use-case 3:** User can get a list of the most recently submitted search strings.

   
## Example usage (get search results):
Use the URL below to search images with by the title "lol cat"
```sh
https://smg-image-search.herokuapp.com/api/imagesearch/lol%20cats?offset=10
```

### JSON Response
```sh
{
"title": "30 Best LOLcats Ever | SMOSH",
"url": "http://www.bing.com/cr?...",
"thumbnail": "https://tse3.mm.bing.net/th?id=OIP.Mda9713ebc2c4c40254b4a04758166c92o0&pid=Api",
"context": "www.smosh.com/smosh-pit/photos/30-best-lol-cats-ever"
}
,{...}
```

## Example usage (get last searches list):
Follow the URL below to get the list of the last 10 searches:
```sh
https://smg-image-search.herokuapp.com/api/latest/imagesearch 
```

### JSON Response
```sh
{
"searchQuery": "lol cats",
"searchDate": "2017-01-21T10:31:01.431Z"
},
{
"searchQuery": "sad cats",
"searchDate": "2017-01-21T09:43:45.953Z"
} 
,{...}
```

## Local Installation

You'll need to have the latest verison of node.js installed. Either use your OS's package manager or follow the installation instructions on the [official website](http://nodejs.org).

Next, [install git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) if it is not already installed. To clone this repository to your local machine, open a command line interface and navigate to your projects directory. Then type

`$ git clone https://github.com/sergiomgaspar/smg-image-search.git`

Move to the `smg-image-search` subdirectory and type `npm install`. This installs all of the API dependencies.

Finally, type `npm start` to start the application. If all goes well, it will be available at `http://localhost:3000`.

## Instalation setup

After installing the API a set of environment variables must be setup:

  - **IMG_API_KEY** - API Key provided by BING *(mandatory)*
  - **MAX_RESULTS** - Number of results per page *(default = 10)*
  - **DEBUG** - Define if debug is active **YES** vs **NO** *(default = NO)*
  - **PORT** - Port Number of express APP *(default = 3000)*
  - **MONGOURL** - Complete URL of mongoDB instance
  - **DBUSER** - User of mongoDB instance *(used if MONGOURL is empty)*
  - **DBPASS** - Password of mongoDB instance *(used if MONGOURL is empty)*

### IMPORTANT
This node app uses MongoDB (free mongoLab instance). The user/password are not correct and you will not be able to logon. Create your instance in mongoLab and **allways define the user and password and environment variables** *(never leave them inside code commited in gitHub!!!)*.
Also, this app uses the Bing API and in order for you to use it you must register an API KEY and set its value in the variable "IMG_API_KEY"

## Technologies used
This is a very small example of an API created in NodeJS using the Express Framework, MongoDB and the Bing API.

## License

[![CC0](http://i.creativecommons.org/p/zero/1.0/88x31.png)](http://creativecommons.org/publicdomain/zero/1.0/)

To the extent possible under law, the author has waived all copyright and related or neighboring rights to this work.

[FreeCodeCamp]: <https://www.freecodecamp.com/challenges/image-search-abstraction-layer>
[Heroku]: <https://smg-image-search.herokuapp.com/>
