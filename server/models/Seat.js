module.exports = (sequelize, DataTypes) => {
    const Seat = sequelize.define("Seat", {
        SeatID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        SeatNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        SeatPrice: {
            type: DataTypes.DECIMAL,
            allowNull: false
        }
    }, {
        timestamps: false,  // Disable automatic createdAt and updatedAt fields
    });

    Seat.associate = (models) => {
        Seat.belongsTo(models.Screen, {
            foreignKey: "ScreenID",
        });
        // Many-to-many relationship with Booking through Booking_Seat
        Seat.belongsToMany(models.Booking, {
            through: models.Booking_Seat,
            foreignKey: "SeatID",
        });
    };

    return Seat;
};
