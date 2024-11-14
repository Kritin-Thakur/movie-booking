module.exports = (sequelize, DataTypes) => {
    const Screen = sequelize.define("Screen", {
        ScreenID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ScreenNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: false,  // Disable automatic createdAt and updatedAt fields
    });


    Screen.associate = (models) => {
        Screen.belongsTo(models.Theater, {
            foreignKey: "TheaterID",
        });
        Screen.hasMany(models.Seat, {
            foreignKey: "ScreenID",
        });
        Screen.hasMany(models.Showtime, {
            foreignKey: "ScreenID",
        });
    };

    return Screen;
};
