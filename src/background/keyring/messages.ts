import { Message, MessageSender } from "../../common/message";
import { ROUTE } from "./constants";
import { KeyRingStatus } from "./keyring";
import { KeyHex } from "./keeper";
import {
  TxBuilderConfigPrimitive,
  TxBuilderConfigPrimitiveWithChainId
} from "./types";
import { AsyncApprover } from "../../common/async-approver";

export class EnableKeyRingMsg extends Message<{
  status: KeyRingStatus;
}> {
  public static type() {
    return "enable-keyring";
  }

  constructor(public readonly chainId: string, public readonly origin: string) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id is empty");
    }
  }

  // Approve external approves sending message if they submit their origin correctly.
  // Keeper or handler must check that this origin has right permission.
  approveExternal(sender: MessageSender): boolean {
    const isInternal = super.approveExternal(sender);
    if (isInternal) {
      return true;
    }

    return Message.checkOriginIsValid(this.origin, sender);
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return EnableKeyRingMsg.type();
  }
}

export class RestoreKeyRingMsg extends Message<{ status: KeyRingStatus }> {
  public static type() {
    return "restore-keyring";
  }

  constructor() {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  validateBasic(): void {}

  route(): string {
    return ROUTE;
  }

  type(): string {
    return RestoreKeyRingMsg.type();
  }
}

export class SaveKeyRingMsg extends Message<{ success: boolean }> {
  public static type() {
    return "save-keyring";
  }

  constructor() {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  validateBasic(): void {}

  route(): string {
    return ROUTE;
  }

  type(): string {
    return SaveKeyRingMsg.type();
  }
}

export class ClearKeyRingMsg extends Message<{ status: KeyRingStatus }> {
  public static type() {
    return "clear-keyring";
  }

  constructor(public readonly password: string) {
    super();
  }

  validateBasic(): void {
    if (!this.password) {
      throw new Error("password not set");
    }
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return ClearKeyRingMsg.type();
  }
}

export class ShowKeyRingMsg extends Message<string> {
  public static type() {
    return "show-keyring";
  }

  constructor(public readonly password: string) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  validateBasic(): void {
    if (!this.password) {
      throw new Error("password not set");
    }
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return ShowKeyRingMsg.type();
  }
}

export class CreateMnemonicKeyMsg extends Message<{ status: KeyRingStatus }> {
  public static type() {
    return "create-mnemonic-key";
  }

  constructor(public readonly mnemonic = "", public readonly password = "") {
    super();
  }

  validateBasic(): void {
    if (!this.mnemonic) {
      throw new Error("mnemonic not set");
    }

    if (!this.password) {
      throw new Error("password not set");
    }
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return CreateMnemonicKeyMsg.type();
  }
}

export class CreatePrivateKeyMsg extends Message<{ status: KeyRingStatus }> {
  public static type() {
    return "create-private-key";
  }

  constructor(
    // Hex encoded bytes.
    public readonly privateKey: string,
    public readonly password = ""
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.privateKey) {
      throw new Error("private not set");
    }

    if (!this.password) {
      throw new Error("password not set");
    }
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return CreatePrivateKeyMsg.type();
  }
}

export class LockKeyRingMsg extends Message<{ status: KeyRingStatus }> {
  public static type() {
    return "lock-keyring";
  }

  constructor() {
    super();
  }

  validateBasic(): void {
    // noop
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return LockKeyRingMsg.type();
  }
}

export class UnlockKeyRingMsg extends Message<{ status: KeyRingStatus }> {
  public static type() {
    return "unlock-keyring";
  }

  constructor(public readonly password = "") {
    super();
  }

  validateBasic(): void {
    if (!this.password) {
      throw new Error("password not set");
    }
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return UnlockKeyRingMsg.type();
  }
}

export class SetPathMsg extends Message<{ success: boolean }> {
  public static type() {
    return "set-path";
  }

  constructor(
    public readonly chainId: string,
    public readonly account: number,
    public readonly index: number
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id not set");
    }

    if (this.account < 0) {
      throw new Error("Invalid account");
    }

    if (this.index < 0) {
      throw new Error("Invalid index");
    }
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return SetPathMsg.type();
  }
}

export class GetKeyMsg extends Message<KeyHex> {
  public static type() {
    return "get-key";
  }

  constructor(public readonly chainId: string, public readonly origin: string) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id not set");
    }
  }

  // Approve external approves sending message if they submit their origin correctly.
  // Keeper or handler must check that this origin has right permission.
  approveExternal(sender: MessageSender): boolean {
    const isInternal = super.approveExternal(sender);
    if (isInternal) {
      return true;
    }

    return Message.checkOriginIsValid(this.origin, sender);
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return GetKeyMsg.type();
  }
}

export class RequestTxBuilderConfigMsg extends Message<{
  config: TxBuilderConfigPrimitive;
}> {
  public static type() {
    return "request-tx-builder-config";
  }

  constructor(
    public readonly config: TxBuilderConfigPrimitiveWithChainId,
    public readonly id: string,
    public readonly openPopup: boolean,
    public readonly origin: string,
    public readonly skipApprove: boolean = false
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.config) {
      throw new Error("config is null");
    }

    AsyncApprover.isValidId(this.id);
  }

  // Approve external approves sending message if they submit their origin correctly.
  // Keeper or handler must check that this origin has right permission.
  approveExternal(sender: MessageSender): boolean {
    const isInternal = super.approveExternal(sender);
    if (isInternal) {
      return true;
    }

    // Skipping approving is allowed only in internal request.
    if (this.skipApprove && !isInternal) {
      return false;
    }

    return Message.checkOriginIsValid(this.origin, sender);
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return RequestTxBuilderConfigMsg.type();
  }
}

export class GetRequestedTxBuilderConfigMsg extends Message<{
  config: TxBuilderConfigPrimitiveWithChainId;
}> {
  public static type() {
    return "get-requested-tx-builder-config";
  }

  constructor(public readonly id: string) {
    super();
  }

  validateBasic(): void {
    AsyncApprover.isValidId(this.id);
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return GetRequestedTxBuilderConfigMsg.type();
  }
}

export class ApproveTxBuilderConfigMsg extends Message<{}> {
  public static type() {
    return "approve-tx-builder-config";
  }

  constructor(
    public readonly id: string,
    public readonly config: TxBuilderConfigPrimitive
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.config) {
      throw new Error("config is empty");
    }

    AsyncApprover.isValidId(this.id);
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return ApproveTxBuilderConfigMsg.type();
  }
}

export class RejectTxBuilderConfigMsg extends Message<{}> {
  public static type() {
    return "reject-tx-builder-config";
  }

  constructor(public readonly id: string) {
    super();
  }

  validateBasic(): void {
    AsyncApprover.isValidId(this.id);
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return RejectTxBuilderConfigMsg.type();
  }
}

export class RequestSignMsg extends Message<{ signatureHex: string }> {
  public static type() {
    return "request-sign";
  }

  constructor(
    public readonly chainId: string,
    public readonly id: string,
    public readonly bech32Address: string,
    // Hex encoded message.
    public readonly messageHex: string,
    public readonly openPopup: boolean,
    public readonly origin: string,
    public readonly skipApprove: boolean = false
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id not set");
    }

    if (!this.bech32Address) {
      throw new Error("bech32 address not set");
    }

    if (!this.messageHex) {
      throw new Error("message is empty");
    }

    AsyncApprover.isValidId(this.id);
  }

  // Approve external approves sending message if they submit their origin correctly.
  // Keeper or handler must check that this origin has right permission.
  approveExternal(sender: MessageSender): boolean {
    const isInternal = super.approveExternal(sender);
    if (isInternal) {
      return true;
    }

    // Skipping approving is allowed only in internal request.
    if (this.skipApprove && !isInternal) {
      return false;
    }

    return Message.checkOriginIsValid(this.origin, sender);
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return RequestSignMsg.type();
  }
}

export class GetRequestedMessage extends Message<{
  chainId: string;
  messageHex: string;
}> {
  public static type() {
    return "get-request-message";
  }

  constructor(public readonly id: string) {
    super();
  }

  validateBasic(): void {
    if (!this.id) {
      throw new Error("id is empty");
    }

    AsyncApprover.isValidId(this.id);
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return GetRequestedMessage.type();
  }
}
export class ApproveSignMsg extends Message<void> {
  public static type() {
    return "approve-sign";
  }

  constructor(public readonly id: string) {
    super();
  }

  validateBasic(): void {
    AsyncApprover.isValidId(this.id);
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return ApproveSignMsg.type();
  }
}

export class RejectSignMsg extends Message<void> {
  public static type() {
    return "reject-sign";
  }

  constructor(public readonly id: string) {
    super();
  }

  validateBasic(): void {
    AsyncApprover.isValidId(this.id);
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return RejectSignMsg.type();
  }
}

export class GetKeyRingTypeMsg extends Message<string> {
  public static type() {
    return "get-keyring-type";
  }

  constructor() {
    super();
  }

  validateBasic(): void {
    // noop
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return GetKeyRingTypeMsg.type();
  }
}
