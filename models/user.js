module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      account_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      uuid: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      wallet_amount: {
        type: DataTypes.DECIMAL(65, 30),
        allowNull: false,
        defaultValue: '0.000000000000000000000000000000',
      },
      location_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(191),
        unique: true,
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING(191),
        allowNull: false,
        unique: true,
      },
      first_name: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      status: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 0,
      },
      phone_number_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_phone_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      phone_code_expire_at: {
        type: DataTypes.DATE(3),
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      total_cashback_point: {
        type: DataTypes.DECIMAL(65, 30),
        allowNull: true,
      },
      num_logins: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      num_logouts: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      last_login_at: {
        type: DataTypes.DATE(3),
        allowNull: true,
      },
      last_logout_at: {
        type: DataTypes.DATE(3),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE(3),
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE(3),
        allowNull: true,
      },
    },
    { timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' },
  );
