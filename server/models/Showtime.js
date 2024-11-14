module.exports = (sequelize, DataTypes) => {
    const Showtime = sequelize.define("Showtime", {
        ShowtimeID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
    }, {
        timestamps: false,  // Disable automatic createdAt and updatedAt fields
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
