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
    },
  },
  validation: {
    isMandatory: "El campo es obligatorio",
    mustBeString: "El campo debe ser una cadena de caracteres",
    mustBeNumber: "El campo debe ser un número",
    mustBeDate: "El campo debe ser una fecha",
    mustBeBoolean: "El campo debe ser un booleano",
    mustBeEnum: (variations) =>
      `El campo debe ser uno de los siguientes valores: ${variations}`,
    mustBeLongerThan: (n) => `El campo debe tener más de ${n} caracteres`,
    mustBeShorterThan: (n) => `El campo debe tener menos de ${n} caracteres`,
    mustBeAfter: (date) => `El campo debe ser posterior a ${date}`,
  },
};

module.exports = messages;
