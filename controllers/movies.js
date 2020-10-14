const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const { Movie } = require('../models/Movie');
const { MovieType } = require('../models/MovieType');
const { Genre } = require('../models/Genre');

/**
 * @swagger
 * /movies:
 *  get:
 *      tags:
 *          - 🎬 Movies
 *      summary: Get all movies
 *      description: (PUBLIC) Get all movies with filtering, sorting & pagination
 *      parameters:
 *          -   in: query
 *              name: select
 *              schema:
 *                  type: string
 *              description: Fields to be selected (Multiple fields separated by comma [,])
 *              example: name,title
 *          -   in: query
 *              name: sort
 *              schema:
 *                  type: string
 *              description: Sort by field (Prefix the field with minus [-] for descending ordering)
 *              example: name,-createdAt
 *          -   in: query
 *              name: limit
 *              schema:
 *                  type: string
 *              default: 20
 *              description: Limit numbers of record for a page
 *              example: 10
 *          -   in: query
 *              name: page
 *              default: 1
 *              schema:
 *                  type: string
 *              description: Certain page index for records to be retrieved
 *              example: 1
 *          -   in: query
 *              name: paging
 *              default: true
 *              schema:
 *                  type: string
 *              description: Define whether need records in pagination
 *              example: false
 *      responses:
 *          200:
 *              description: OK
 *          500:
 *              description: Internal server error
 */
exports.getMovies = asyncHandler(async (req, res, next) => {
    res.standard(200, true, 'Success', res.listJsonData);
});

/**
 * @swagger
 * /movies:
 *  post:
 *      tags:
 *          - 🎬 Movies
 *      summary: Create a movie
 *      description: (ADMIN) Create a movie
 *      parameters:
 *          -   in: body
 *              name: movie
 *              description: Movie to be created
 *              schema:
 *                  type: object
 *                  required:
 *                      - title
 *                      - description
 *                      - ticketPrice
 *                      - durationInMinutes
 *                      - releasedDate
 *                      - genreIds
 *                      - movieTypeId
 *                  properties:
 *                      title:
 *                          type: string
 *                          maxLength: 100
 *                          example: Spiderman
 *                      description:
 *                          type: string
 *                          example: Superhero born with climbing ability
 *                      ticketPrice:
 *                          type: number
 *                          example: 2.5
 *                      durationInMinutes:
 *                          type: integer
 *                          example: 120
 *                      releasedDate:
 *                          type: string
 *                          format: date
 *                          example: "2020-02-10"
 *                      genreIds:
 *                          type: array
 *                          items:
 *                              type: string
 *                          example: ["5f85b4bb8be19d2788193471", "5f85b58f15173c139c7476b7"]
 *                      movieTypeId:
 *                          type: string
 *                          example: 5f84030ea795143ed451ddbf
 *                      trailerUrl:
 *                          type: string
 *                          example: https://youtu.be/dR3cjXncoSk
 *                      posterUrl:
 *                          type: string
 *                          example: https://i.pinimg.com/originals/e6/a2/5a/e6a25a2855e741f7461fe1698db3153a.jpg
 *      responses:
 *          201:
 *              description: Created
 *          400:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 */
exports.createMovie = asyncHandler(async (req, res, next) => {
    const genreIds = req.body.genreIds;
    let genre;
    for (id of genreIds) {
        genre = await Genre.findById(id);

        if (!genre) {
            return next(
                new ErrorResponse(
                    `Genre with given ID (${id}) is not found`,
                    404
                )
            );
        }
    }

    const movieTypeId = req.body.movieTypeId;
    const movieType = await MovieType.findById(movieTypeId);
    if (!movieType) {
        return next(
            new ErrorResponse(
                `Movie type with given ID (${movieTypeId}) is not found`,
                404
            )
        );
    }

    req.body.genres = genreIds;
    req.body.movieType = movieTypeId;

    const movie = await Movie.create(req.body);

    res.standard(201, true, 'Movie is created successfully', movie);
});
