const messages = {
  team: {
    error: {
      emptyName: "El nombre del equipo no puede estar vacío",
      longName: "El nombre del equipo debe tener máximo 40 caracteres",
      duplicateName: "El nombre del equipo ya existe",
      duplicateTeamMember: "El usuario ya pertenece a este equipo",
      teamDoesNotExist: "El equipo no existe",
      teamMemberDoesNotExist: "El usuario no pertenece a este equipo",
    },
    success: {
      teamCreated: "Equipo creado correctamente",
      teamDeleted: "Equipo eliminado correctamente",
      teamActivated: "Equipo activado correctamente",
      teamMemberAdded: "Usuario agregado al equipo correctamente",
      teamMemberRemoved: "Usuario eliminado del equipo correctamente",
    }
  },
};

module.exports = messages;
