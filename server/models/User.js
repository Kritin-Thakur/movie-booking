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
        isAdmin: {  // New field to mark admins
            type: DataTypes.BOOLEAN,
            defaultValue: false, // Default to false for regular users
        }
    }, {
        timestamps: false,  // Disable automatic createdAt and updatedAt fields
    });

    User.associate = (models) => {
        User.hasMany(models.Booking, {
            foreignKey: "UserName",
        });
    };

    return User;
};