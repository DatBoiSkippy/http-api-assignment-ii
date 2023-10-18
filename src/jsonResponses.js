const http = require('http');

const reviews = {};

const respondJSON = (request, response, status, object) => {

    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(object));
    response.end();
};

const respondJSONMeta = (request, response, status) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.end();
}

//POST request, searches the alcohol requested by the user
const searchAlc = async (request, response, body) => {
    const responseJSON = {};
    if (!body.search) {
        responseJSON.message = 'Missing Search Parameter';
        return respondJSON(request, response, 400, responseJSON);
    }
    const url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + bdy.search;

    try {
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.text();
            const jsonParse = JSON.parse(data);
            if (jsonParse.drinks == null) {
                notFound(request, response);
            } else {
                respondJSON(request, response, 200, data);
            }
        } else {
            notFound(request, response);
        }
    } catch (error) {
        notFound(request, response);
    }
}

const getReviews = (request, response) => {
    const responseJSON = {
        reviews
    };
    return respondJSON(request, response, 200, responseJSON);
};

const getReviewsMeta = (request, response) => respondJSONMeta(request, response, 200);
const setReview = async (request, response, body) => {
    const responseJSON = {
        message: 'Requires input',
    };

    if (!body.review) {
        responseJSON.message = 'Missing Review Parameter';
        return respondJSON(request, response, 400, responseJSON);
    }

    let responseCode = 204;

    if (!reviews[body.user]) {
        responseCode = 201;
        reviews[body.user] = {};
        reviews[body.user][body.name] = {};
    }

    reviews[body.user][body.name].review = body.review;
    reviews[body.user][body.name].id = body.id;

    if (responseCode === 201) {
        responseJSON.message = 'Created Successfully';
        return respondJSON(request, response, responseCode, responseJSON);
    }

    return respondJSONMeta(request, response, responseCode);
}
const notFound = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found.',
        id: 'notFound',
    };

    respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

const getRandomAlc = async (request, response) => {
    const url = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
    try {
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.text();
            respondJSON(request, response, 200, data);
        } else {
            notFound(request, response);
        }
    } catch (error) {
        notFound(request, response);
    }
}

const getRandomAlcMeta = (request, response) => respondJSONMeta(request, response, 200);

module.exports = {
    respondJSON,
    respondJSONMeta,
    searchAlc,
    setReview,
    getReviews,
    getReviewsMeta,
    notFound,
    getRandomAlc,
    getRandomAlcMeta,
    notFoundMeta,
};  