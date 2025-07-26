import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

module.exports = buildModule("FundMeModule", (m) => {
  const fundMe = m.contract("FundMe");
  return { fundMe };
});
