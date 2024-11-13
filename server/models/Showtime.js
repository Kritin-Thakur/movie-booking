module.exports = (sequelize, DataTypes) => {
    const Showtime = sequelize.define("Showtime", {
        ShowtimeID: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        StartTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        EndTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        Date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    });

    Showtime.associate = (models) => {
        Showtime.belongsTo(models.Screen, {
            foreignKey: "ScreenID",
        });
        Showtime.belongsTo(models.Movie, {
            foreignKey: "MovieID",
        });
        Showtime.hasMany(models.Booking, {
            foreignKey: "ShowtimeID",
        });
    };

    return Showtime;
};
