<!--
  Dependency / Audit PR template
  Use this template for PRs that update dependencies or address audit findings.
-->

## Résumé

- **Type**: dependency / audit fix
- **Contexte**: (expliquer brièvement la source — Dependabot, npm audit, manuel)

## Détails des changements

- Liste des packages mis à jour et versions (ex: `package@from -> to`)
- Résumé des vulnérabilités corrigées et leur niveau (low/moderate/high/critical)

## Vérifications et tests

- [ ] Tests unitaires et d'intégration locaux passés
- [ ] CI green (tests & audit step)
- [ ] Vérifié le code pour breaking changes (notes si applicable)

## Plan de déploiement

- Rollout: déployer en staging d'abord
- Monitor: vérifier erreurs et métriques pendant 15-30 minutes post-deploy
- Rollback: comment revenir en arrière (revert PR / redeploy previous image)

## Notes pour le reviewer

- Si la mise à jour est d'une `devDependency` (ex: Jest), indiquez si elle change la manière de lancer les tests/local dev.
- Pour les mises à jour majeures, liste des points à vérifier manuellement.

---

Merci de vérifier les logs CI et valider que `npm audit` ne retourne pas de vulnérabilités `high`/`critical`.
