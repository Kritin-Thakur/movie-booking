module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        UserName: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        Phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    User.associate = (models) => {
        User.hasMany(models.Booking, {
            foreignKey: "UserID",
        });
    };

    return User;
};
