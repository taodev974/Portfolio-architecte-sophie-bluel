module.exports = (req, res, next) => {
  try {
    const host = req.get("host");
    const title = req.body.title?.trim();
    const categoryId = parseInt(req.body.category);
    const userId = req.auth.userId;

    // Vérrification du fichier
    if (!File) {
      return res.status(400).json({ error: "Aucun fichier envoyé" });
    }

    // Vérrification du type réel du fichier
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(File.mimetype)) {
      return res.status(400).json({ error: "Extension non autorisée" });
    }

    // Vérrification de la taille réelle
    if (file.size > 4 * 1024 * 1024) {
      return res.status(400).json({ error: "Fichier trop lourd (max 4MB)" });
    }

    // Construction de l'URL de l'image
    const imageUrl = `${req.protocol}://${host}/images/${file.filename}`;

    // Vérrification des champs obligatoires
    if (
      !title ||
      title.length === 0 ||
      !categoryId ||
      categoryId <= 0 ||
      !userId ||
      userId <= 0
    ) {
      return res.status(400).json({ erro: "Champs invalides ou manquants" });
    }

    // Tout est OK - on prépare l'objet pour le controller
    req.work = { title, categoryId, userId, imageUrl };
    next();
  } catch (e) {
    return res
      .status(500)
      .json({ error: new Error("Une erreur interne est survenue") });
  }
};
