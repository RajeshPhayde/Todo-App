import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);

// Function to add default roles if they do not exist
const addDefaultRoles = async () => {
  try {
    const existingRoles = await Role.find();

    // Check if 'admin' and 'user' roles exist
    if (!existingRoles.some((role) => role.name === "admin")) {
      await Role.create({
        name: "admin",
        description: "Administrator with full access",
      });
    }

    if (!existingRoles.some((role) => role.name === "user")) {
      await Role.create({
        name: "user",
        description: "Regular user with limited access",
      });
    }
  } catch (error) {
    console.error("Error adding default roles:", error);
  }
};

export { Role, addDefaultRoles };
