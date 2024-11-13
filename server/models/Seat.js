module.exports = (sequelize, DataTypes) => {
    const Seat = sequelize.define("Seat", {
        SeatID: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        SeatNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
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
