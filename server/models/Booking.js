module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define("Booking", {
        BookingID: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        BookingDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        PaymentStatus: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        TotalAmount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
    });

    Booking.associate = (models) => {
        Booking.belongsTo(models.User, {
            foreignKey: "UserID",
        });
        Booking.belongsTo(models.Showtime, {
            foreignKey: "ShowtimeID",
        });
        // Many-to-many relationship with Seat through Booking_Seat
        Booking.belongsToMany(models.Seat, {
            through: models.Booking_Seat,
            foreignKey: "BookingID",
        });
    };

    return Booking;
};
