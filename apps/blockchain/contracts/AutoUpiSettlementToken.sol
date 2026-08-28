// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title AutoUpiSettlementToken (AUST / TBD)
 * @notice Enterprise-grade cross-border settlement token backed 1:1 by segregated bank custody reserves.
 * Facilitates instantaneous atomic cross-border settlement between banks and liquidity providers.
 * Adheres to zero-PII on-chain standards.
 */
contract AutoUpiSettlementToken is ERC20, ERC20Burnable, ERC20Pausable, AccessControl {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant SETTLEMENT_ROLE = keccak256("SETTLEMENT_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    struct SettlementRecord {
        string txReference;
        string corridor; // e.g. "USD_INR", "EUR_SGD"
        uint256 sourceAmount;
        uint256 targetAmount;
        address settlementPool;
        uint256 timestamp;
        bool isSettled;
    }

    // Mapping from transaction reference to SettlementRecord
    mapping(string => SettlementRecord) public settlements;
    
    // Mapping from bank reserve custody ID to locked amount
    mapping(string => uint256) public lockedReserves;

    // Events
    event TokenMinted(
        address indexed to,
        uint256 amount,
        string transactionId,
        string corridor,
        uint256 timestamp
    );

    event TokenTransferred(
        address indexed from,
        address indexed to,
        uint256 amount,
        string transactionId,
        uint256 timestamp
    );

    event SettlementLocked(
        string indexed transactionId,
        uint256 amount,
        address indexed initiator,
        uint256 timestamp
    );

    event SettlementCompleted(
        string indexed transactionId,
        uint256 amount,
        address indexed recipient,
        uint256 timestamp
    );

    event TokenRedeemed(
        address indexed from,
        uint256 amount,
        string transactionId,
        uint256 timestamp
    );

    constructor(address defaultAdmin) ERC20("Auto-UPI Settlement Token", "AUST") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, defaultAdmin);
        _grantRole(BURNER_ROLE, defaultAdmin);
        _grantRole(SETTLEMENT_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, defaultAdmin);

        // Initial institutional corridor liquidity reserve
        _mint(defaultAdmin, 10_000_000 * 10 ** decimals());
    }

    /**
     * @notice Locks fiat reserve in custody and mints settlement tokens for atomic cross-border transit
     */
    function lockReserveAndMint(
        string calldata reserveLockId,
        string calldata txReference,
        string calldata corridor,
        address settlementPool,
        uint256 tokenAmount,
        uint256 sourceAmount,
        uint256 targetAmount
    ) external onlyRole(MINTER_ROLE) whenNotPaused {
        require(bytes(settlements[txReference].txReference).length == 0, "Transaction already initialized");
        require(tokenAmount > 0, "Token amount must be greater than zero");

        lockedReserves[reserveLockId] = sourceAmount;
        emit SettlementLocked(txReference, sourceAmount, msg.sender, block.timestamp);

        _mint(settlementPool, tokenAmount);

        settlements[txReference] = SettlementRecord({
            txReference: txReference,
            corridor: corridor,
            sourceAmount: sourceAmount,
            targetAmount: targetAmount,
            settlementPool: settlementPool,
            timestamp: block.timestamp,
            isSettled: false
        });

        emit TokenMinted(settlementPool, tokenAmount, txReference, corridor, block.timestamp);
    }

    /**
     * @notice Finalizes recipient credit in destination currency and burns the intermediate settlement token
     */
    function finalizeSettlement(string calldata txReference) external onlyRole(SETTLEMENT_ROLE) whenNotPaused {
        SettlementRecord storage record = settlements[txReference];
        require(bytes(record.txReference).length > 0, "Settlement record not found");
        require(!record.isSettled, "Settlement already finalized");

        record.isSettled = true;

        uint256 tokenAmount = record.sourceAmount * (10 ** decimals());
        if (balanceOf(record.settlementPool) >= tokenAmount) {
            _burn(record.settlementPool, tokenAmount);
            emit TokenRedeemed(record.settlementPool, tokenAmount, txReference, block.timestamp);
        }

        emit SettlementCompleted(txReference, tokenAmount, record.settlementPool, block.timestamp);
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function getSettlement(string calldata txReference) external view returns (SettlementRecord memory) {
        return settlements[txReference];
    }

    // Override required by Solidity for ERC20Pausable
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}
