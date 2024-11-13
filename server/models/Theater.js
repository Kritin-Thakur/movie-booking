module.exports = (sequelize, DataTypes) => {
    const Theater = sequelize.define("Theater", {
        TheaterID: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        TheaterName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    Theater.associate = (models) => {
        Theater.hasMany(models.Screen, {
            foreignKey: "TheaterID",
        });
    };

    return Theater;
};
