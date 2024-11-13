module.exports = (sequelize, DataTypes) => {
    const Screen = sequelize.define("Screen", {
        ScreenID: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        ScreenNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
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
