import { Router, Response } from "express";
import { services } from "../../services/services";

import {
  createEndpoint,
  createContractEndpoint,
  checkAllByChainAndAddressEndpoint,
  checkByChainAndAddressesEnpoint,
} from "./repository.handlers";
import { safeHandler } from "../controllers.common";

const REPOSITORY_CONTROLLER_PREFIX = "/files";

const router: Router = Router();

[
  {
    prefix: "/tree/any",
    method: createEndpoint(services.repository.getTree, "any_match", true),
  },
  {
    prefix: "/any",
    method: createEndpoint(services.repository.getContent, "any_match", true),
  },
  {
    prefix: "/tree",
    method: createEndpoint(services.repository.getTree, "full_match"),
  },
  {
    prefix: "/contracts",
    method: createContractEndpoint(services.repository.getContracts),
  },
  {
    prefix: "",
    method: createEndpoint(services.repository.getContent, "full_match"),
  },
].forEach((pair) => {
  /* const validators = [param("chain").custom(isValidChain)];
  if (pair.prefix != "/contracts")
    validators.push(param("address").custom(isValidAddress)); */
  router
    .route(
      pair.prefix != "/contracts"
        ? REPOSITORY_CONTROLLER_PREFIX + pair.prefix + "/:chain/:address"
        : REPOSITORY_CONTROLLER_PREFIX + pair.prefix + "/:chain"
    )
    .get(safeHandler(pair.method));
});

// check(All)ByAddresses endpoints have different format then the ones above. check(All)ByAddresses take query params instead of path params.
router
  .route("/check-all-by-addresses")
  .get(safeHandler(checkAllByChainAndAddressEndpoint));

router
  .route("/check-by-addresses")
  .get(safeHandler(checkByChainAndAddressesEnpoint));

export const deprecatedRoutesRepository = {
  "/checkAllByAddresses": "/check-all-by-addresses",
  "/checkByAddresses": "/check-by-addresses",
};

export default router;
