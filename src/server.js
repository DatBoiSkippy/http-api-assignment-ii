const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    GET: {
        '/': htmlHandler.getIndex,
        '/style.css': htmlHandler.getCSS,
        '/getAlcohol': jsonHandler.getRandomAlc,
        '/getReviews': jsonHandler.getReviews,
        notFound: jsonHandler.notFound,
    },
    HEAD: {
        '/getAlcohol': jsonHandler.getRandomAlcMeta,
        '/getReviews': jsonHandler.getReviewsMeta,
        notFound: jsonHandler.notFoundMeta,
    },
}

const parseBody = (request, response, handler) => {

    const body = [];

    request.on('error', (err) => {
        F
        response.statusCode = 400;
        response.end();
    });

    request.on('data', (chunk) => {

        body.push(chunk);
    })

    request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        const bodyParams = query.parse(bodyString);

        handler(request, response, bodyParams);
    });
};

//Handles post requests, only two currently
const handlePost = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/searchAlcohol') {
        parseBody(request, response, jsonHandler.searchAlc);
    }
    if (parsedUrl.pathname === '/setReview') {
        parseBody(request, response, jsonHandler.setReview);
    }
}
const onRequest = (request, response) => {
    const parsedUrl = url.parse(request.url);

    if (request.method === 'POST') {
        return handlePost(request, response, parsedUrl);
    }
    else if (urlStruct[request.method][parsedUrl.pathname]) {
        return urlStruct[request.method][parsedUrl.pathname](request, response);
    }

    return urlStruct[request.method].notFound(request, response);
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
})