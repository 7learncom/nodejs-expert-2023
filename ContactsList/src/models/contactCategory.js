import { DataTypes } from "sequelize";

export default function(sequelize) {
    return sequelize.define('ContactCategory', {
        name: {
            type: DataTypes.STRING(20),
            unique: true,
        },
    });
}
