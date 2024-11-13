module.exports = (sequelize, DataTypes) => {
    const Movie = sequelize.define("Movie", {
        MovieID: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        Title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Genre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    Movie.associate = (models) => {
        Movie.hasMany(models.Showtime, {
            foreignKey: "MovieID",
        });
    };

    return Movie;
};
