const messages = {
  team: {
    error: {
      emptyName: "El nombre del equipo no puede estar vacío",
      longName: "El nombre del equipo debe tener máximo 40 caracteres",
      duplicateName: "El nombre del equipo ya existe",
      duplicateTeamMember: "El usuario ya pertenece a este equipo",
      teamDoesNotExist: "El equipo no existe",
    },
    success: {
      teamCreated: "Equipo creado correctamente",
      teamDeleted: "Equipo eliminado correctamente",
      teamActivated: "Equipo activado correctamente",
      teamMemberAdded: "Usuario agregado al equipo correctamente",
    }
  },
};

module.exports = messages;
