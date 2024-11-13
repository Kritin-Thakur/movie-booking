module.exports = (sequelize, DataTypes) => {
    const Booking_Seat = sequelize.define("Booking_Seat", {
        BookingID: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        SeatID: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
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
