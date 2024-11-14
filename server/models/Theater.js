module.exports = (sequelize, DataTypes) => {
    const Theater = sequelize.define("Theater", {
        TheaterID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        TheaterName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: false,  // Disable automatic createdAt and updatedAt fields
    });

    Theater.associate = (models) => {
        Theater.hasMany(models.Screen, {
            foreignKey: "TheaterID",
        });
    };

    return Theater;
};
