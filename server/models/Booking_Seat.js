module.exports = (sequelize, DataTypes) => {
    const Booking_Seat = sequelize.define("Booking_Seat", {
        BookingID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        SeatID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
    }, {
        timestamps: false,  // Disable automatic createdAt and updatedAt fields
    });

    Booking_Seat.associate = (models) => {
        Booking_Seat.belongsTo(models.Booking, {
            foreignKey: "BookingID",
        });
        Booking_Seat.belongsTo(models.Seat, {
            foreignKey: "SeatID",
        });
    };

    return Booking_Seat;
};
