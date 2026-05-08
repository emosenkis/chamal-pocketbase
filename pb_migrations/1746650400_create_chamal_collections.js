migrate(
  (app) => {
    const authRule = '@request.auth.id != ""';
    let usersCollectionExists = true;

    try {
      app.findCollectionByNameOrId("users");
    } catch (_) {
      usersCollectionExists = false;
    }

    if (!usersCollectionExists) {
      const users = new Collection({
        name: "users",
        type: "auth",
        listRule: "id = @request.auth.id",
        viewRule: "id = @request.auth.id",
        createRule: null,
        updateRule: "id = @request.auth.id",
        deleteRule: "id = @request.auth.id",
        fields: [
          {
            name: "name",
            type: "text",
            required: false,
            max: 255,
          },
          {
            name: "role",
            type: "text",
            required: false,
            max: 64,
          },
        ],
      });
      app.save(users);
    }

    const meguyasot = new Collection({
      name: "meguyasot",
      type: "base",
      listRule: authRule,
      viewRule: authRule,
      createRule: authRule,
      updateRule: authRule,
      deleteRule: authRule,
      fields: [
        {
          name: "legacyId",
          type: "number",
          required: false,
          noDecimal: true,
        },
        {
          name: "name",
          type: "text",
          required: true,
          max: 255,
        },
        {
          name: "status",
          type: "select",
          required: true,
          values: ["active", "distant", "inactive"],
          maxSelect: 1,
        },
        {
          name: "adopter",
          type: "text",
          required: false,
          max: 255,
        },
        {
          name: "details",
          type: "json",
          required: false,
        },
        {
          name: "legacyCreatedAt",
          type: "text",
          required: false,
          max: 64,
        },
      ],
      indexes: [
        "CREATE UNIQUE INDEX idx_meguyasot_legacy_id ON meguyasot (legacyId)",
        "CREATE UNIQUE INDEX idx_meguyasot_name ON meguyasot (name)",
      ],
    });
    app.save(meguyasot);

    const volunteers = new Collection({
      name: "volunteers",
      type: "base",
      listRule: authRule,
      viewRule: authRule,
      createRule: authRule,
      updateRule: authRule,
      deleteRule: authRule,
      fields: [
        {
          name: "legacyId",
          type: "number",
          required: false,
          noDecimal: true,
        },
        {
          name: "name",
          type: "text",
          required: true,
          max: 255,
        },
        {
          name: "active",
          type: "bool",
          required: false,
        },
        {
          name: "needs_reminders",
          type: "bool",
          required: false,
        },
        {
          name: "details",
          type: "json",
          required: false,
        },
        {
          name: "legacyCreatedAt",
          type: "text",
          required: false,
          max: 64,
        },
      ],
      indexes: [
        "CREATE UNIQUE INDEX idx_volunteers_legacy_id ON volunteers (legacyId)",
        "CREATE UNIQUE INDEX idx_volunteers_name ON volunteers (name)",
      ],
    });
    app.save(volunteers);

    const meals = new Collection({
      name: "meals",
      type: "base",
      listRule: authRule,
      viewRule: authRule,
      createRule: authRule,
      updateRule: authRule,
      deleteRule: authRule,
      fields: [
        {
          name: "legacyId",
          type: "number",
          required: false,
          noDecimal: true,
        },
        {
          name: "date",
          type: "text",
          required: true,
          max: 10,
        },
        {
          name: "meal",
          type: "text",
          required: true,
          max: 255,
        },
        {
          name: "meguyeset",
          type: "relation",
          required: true,
          minSelect: 1,
          maxSelect: 1,
          collectionId: meguyasot.id,
          cascadeDelete: false,
        },
        {
          name: "volunteer",
          type: "relation",
          required: false,
          maxSelect: 1,
          collectionId: volunteers.id,
          cascadeDelete: false,
        },
        {
          name: "details",
          type: "json",
          required: false,
        },
        {
          name: "legacyCreatedAt",
          type: "text",
          required: false,
          max: 64,
        },
      ],
      indexes: [
        "CREATE UNIQUE INDEX idx_meals_legacy_id ON meals (legacyId)",
      ],
    });
    app.save(meals);
  },
  (app) => {
    const names = ["meals", "volunteers", "meguyasot"];

    for (const name of names) {
      try {
        const collection = app.findCollectionByNameOrId(name);
        app.delete(collection);
      } catch (_) {
        // Ignore missing collections during rollback.
      }
    }
  }
);
