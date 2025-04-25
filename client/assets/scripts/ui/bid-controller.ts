import { _decorator, Component, Node, Label, Button, ScrollView, Prefab, instantiate, Layout, Color, Event } from 'cc';
import { CountListItem } from '../prefabs/count-list-item';
import { Bid, Face } from '../../../../shared/protocols/game-types.d';
import { BidValidator } from '../utils/bid-validator';

const { ccclass, property } = _decorator;

@ccclass('BidController')
export class BidController extends Component {

    // --- UI References ---
    @property(Button)
    private bidButton: Button | null = null;

    @property(Button)
    private challengeButton: Button | null = null;

    @property(Button)
    private spotOnButton: Button | null = null;

    @property(Node) // Parent node containing ValueButton1-6
    private valueSelectorNode: Node | null = null;

    @property(ScrollView) // ScrollView for quantities
    private countScrollView: ScrollView | null = null;

    @property(Node) // Content node of the ScrollView (with Layout)
    private countListContentNode: Node | null = null;

    @property(Prefab) // Prefab for quantity list items
    private countListItemPrefab: Prefab | null = null;

    @property(Label) // Label to display the current highest bid
    private currentBidLabel: Label | null = null;

    // --- Internal State ---
    private _currentBid: Bid | [0, 0] = [0, 0]; // Current highest bid
    private _selectedBidValue: Face | 0 = 0;    // Player's selected face value (1-6, or 0 if none)
    private _selectedBidCount: number = 0;      // Player's selected quantity (0 if none)
    private _totalDiceInGame: number = 0;       // Total dice currently in play
    private _isMyTurn: boolean = false;         // Is it the current player's turn?
    private _selectedCountListItemNode: Node | null = null; // Reference to the highlighted count item node
    private _selectedValueButtonNode: Node | null = null; // Reference to the highlighted face value button node
    private _instantiatedCountItems: CountListItem[] = []; // Array to hold instantiated CountListItem components
    private _minSelectableCount: number = 1; // Minimum quantity selectable based on current bid

    /**
     * Initializes the BidController.
     * @param totalDice Initial total number of dice in the game.
     */
    public initialize(totalDice: number): void {
        this._totalDiceInGame = totalDice;
        this._currentBid = [0, 0];
        this._isMyTurn = false;
        this.populateInitialCountItems(); // Create quantity items
        this.resetSelection(); // Set initial UI state (buttons disabled, etc.)
        this.updateCurrentBidDisplay(); // Show initial bid status

        // Ensure parent nodes are visible (might be needed if panel was hidden)
        this.ensureVisibility();

        console.log(`[BidController] Initialized. Total Dice: ${totalDice}`);
    }

    /**
     * Populates the quantity selection list based on the total dice.
     */
     private populateInitialCountItems(): void {
         if (!this.countListContentNode || !this.countListItemPrefab) {
             console.error("[BidController] Count list content node or item prefab not set!");
             return;
         }
         this.countListContentNode.removeAllChildren();
         this._instantiatedCountItems = [];

         console.log(`[BidController] Populating count items up to ${this._totalDiceInGame}`);

         for (let i = 1; i <= this._totalDiceInGame; i++) {
             const itemNode = instantiate(this.countListItemPrefab);
             const countListItem = itemNode.getComponent(CountListItem);

             if (countListItem) {
                 // Pass `this` (BidController instance) as the handler target
                 countListItem.setup(i, this); // CountListItem will call this.handleCountSelection
                 this.countListContentNode.addChild(itemNode);
                 this._instantiatedCountItems.push(countListItem);
             } else {
                 console.error(`[BidController] CountListItem component not found on prefab instance for count ${i}`);
                 itemNode.destroy();
             }
         }
         // Update layout and scroll to top
         this.countListContentNode.getComponent(Layout)?.updateLayout();
         this.countScrollView?.scrollToTop(0.1);
     }

    /**
     * Updates the controller's state based on new game state data.
     * @param isMyTurn Is it the current player's turn?
     * @param currentBid The current highest bid [face, count].
     * @param totalDiceInGame The total number of dice now in the game.
     */
    public updateState(isMyTurn: boolean, currentBid: Bid | [0, 0], totalDiceInGame: number): void {
        console.log(`[BidController] updateState: Turn=${isMyTurn}, Bid=[${currentBid[0]}, ${currentBid[1]}], TotalDice=${totalDiceInGame}`);

        this._isMyTurn = isMyTurn;
        this._currentBid = currentBid;

        // Repopulate quantity list if total dice changed
        if (this._totalDiceInGame !== totalDiceInGame) {
            console.log(`[BidController] Total dice changed from ${this._totalDiceInGame} to ${totalDiceInGame}. Repopulating count items.`);
            this._totalDiceInGame = totalDiceInGame;
            this.populateInitialCountItems(); // This also resets count item states
        }

        // Always reset selections when state updates
        this.resetSelection();

        // Update challenge/spot-on buttons
        const hasPreviousBid = this._currentBid[1] > 0;
        if (this.challengeButton) this.challengeButton.interactable = this._isMyTurn && hasPreviousBid;
        if (this.spotOnButton) this.spotOnButton.interactable = this._isMyTurn && hasPreviousBid;

        // Update the current bid display label
        this.updateCurrentBidDisplay();

        // Calculate the minimum quantity the player *must* select
        const [currentValueFace, currentCount] = this._currentBid;
        if (currentCount === 0) {
            this._minSelectableCount = 1;
        } else {
            // If current bid is max possible value (1, effective value 7), must increase count
            const currentEffectiveValue = BidValidator['getEffectiveValue'](currentValueFace); // Use helper directly
            this._minSelectableCount = currentEffectiveValue === 7 ? currentCount + 1 : currentCount;
        }
        console.log(`[BidController] updateState: Minimum selectable count is ${this._minSelectableCount}`);

        // Update quantity buttons based on the minimum required count
        this._updateAvailableQuantities();

        // Initially disable all face buttons (they get enabled after quantity selection)
        this._updateFaceButtons(7 as Face); // 7 disables all

        // Show/hide selectors based on turn
        if (this.valueSelectorNode) this.valueSelectorNode.active = this._isMyTurn;
        if (this.countScrollView?.node) this.countScrollView.node.active = this._isMyTurn;

        // Ensure bid button is disabled
        if (this.bidButton) this.bidButton.interactable = false;

        // Ensure the controller node itself is active
        this.ensureVisibility();
    }

    /**
     * Resets the player's current selection (quantity and face).
     */
    public resetSelection(): void {
        console.log("[BidController] Resetting selection.");
        // Reset internal state
        this._selectedBidCount = 0;
        this._selectedBidValue = 0;
        // Reset UI highlights
        this.highlightSelectedCountItem(null);
        this.highlightSelectedValueButton(null);
        // Disable bid button
        if (this.bidButton) this.bidButton.interactable = false;
        // Disable all face buttons
        this._updateFaceButtons(7 as Face); // 7 disables all
    }

    /**
     * Ensures the BidController node and its parents are active.
     */
    private ensureVisibility(): void {
        let nodeToCheck: Node | null = this.node;
        while (nodeToCheck) {
            if (!nodeToCheck.active) {
                console.log(`[BidController] Activating inactive node: ${nodeToCheck.name}`);
                nodeToCheck.active = true;
            }
            nodeToCheck = nodeToCheck.parent;
        }
    }

    /**
     * Updates the label displaying the current highest bid.
     */
    private updateCurrentBidDisplay(): void {
        if (!this.currentBidLabel) return;
        const [value, count] = this._currentBid;

        if (count === 0) {
            this.currentBidLabel.string = "等待首次叫价";
        } else {
            // Use BidValidator's helpers for consistency
            if (BidValidator.validFace(value)) {
                this.currentBidLabel.string = `当前: ${count}个 ${BidValidator.getFaceLabel(value)}`;
            } else {
                console.warn("[BidController] updateCurrentBidDisplay: Invalid face value in _currentBid:", value);
                this.currentBidLabel.string = `当前: ${count}个 ?`;
            }
        }
    }

    // --- Selection Handlers (New Flow: Quantity -> Face) ---

    /**
     * Handles clicks on quantity list items. Called by CountListItem instances.
     * @param detail Contains `{ count: number, node: Node }` from the clicked item.
     */
    public handleCountSelection(detail: { count: number, node: Node }): void {
         if (!this._isMyTurn) return; // Ignore if not player's turn

        console.log(`[BidController] handleCountSelection: Count=${detail.count}`);
        if (!detail || typeof detail.count !== 'number' || isNaN(detail.count) || !detail.node) {
            console.error("[BidController] Invalid data from count-selected event:", detail);
            return;
        }

        // Update selected count and highlight
        this._selectedBidCount = detail.count;
        this.highlightSelectedCountItem(detail.node);

        // Reset selected face value and highlight
        this._selectedBidValue = 0;
        this.highlightSelectedValueButton(null);

        // Determine the minimum face value allowed for the selected quantity
        const minFace = BidValidator.getMinValidFace(this._selectedBidCount, this._currentBid);
        console.log(`[BidController] Minimum valid face for count ${this._selectedBidCount} is: ${minFace}`);

        // Update the interactability of face buttons based on the minimum face
        this._updateFaceButtons(minFace);

        // Disable bid button because a face value hasn't been selected yet
        if (this.bidButton) this.bidButton.interactable = false;
    }

    /**
     * Handles clicks on face value buttons (1-6). Called via editor event binding.
     * @param event The event object.
     * @param valueString The string value ("1" to "6") associated with the button.
     */
    public onValueSelect(event: Event, valueString: string): void {
        if (!this._isMyTurn || this._selectedBidCount === 0) return; // Must select quantity first

        console.log(`[BidController] onValueSelect: Value=${valueString}`);
        const parsedValue = parseInt(valueString);

        if (BidValidator.validFace(parsedValue)) {
            this._selectedBidValue = parsedValue;
            // Highlight the selected button
            const targetNode = event.currentTarget;
            if (targetNode instanceof Node) {
                this.highlightSelectedValueButton(targetNode);
            } else {
                this.highlightSelectedValueButton(null);
            }
            // Validate if the bid button can now be enabled
            this.validateAndEnableBidButton();
        } else {
            console.warn("[BidController] Invalid face value clicked:", valueString);
        }
    }

    // --- UI Update Helpers ---

    /**
     * Updates the interactability of face value buttons based on the minimum allowed face.
     * @param minFace The minimum face value (1-6) allowed. Faces below this are disabled. If 7, all are disabled.
     */
    private _updateFaceButtons(minFace: Face | 7): void {
        if (!this.valueSelectorNode) return;

        this.valueSelectorNode.children.forEach(btnNode => {
            const button = btnNode.getComponent(Button);
            // Assuming button nodes are named like "ValueButton1", "ValueButton2", etc.
            const faceValue = parseInt(btnNode.name.replace('ValueButton', ''));

            if (button && BidValidator.validFace(faceValue)) {
                // Enable if it's player's turn, minFace is valid (<=6), and button's face >= minFace
                button.interactable = this._isMyTurn && minFace <= 6 && faceValue >= minFace;
            } else if (button) {
                button.interactable = false; // Disable non-standard buttons
            }
        });
    }

    /**
     * Updates the interactability and visibility of quantity list items based on the minimum required count.
     */
    private _updateAvailableQuantities(): void {
        if (!this.countListContentNode) return;
        console.log(`[BidController] Updating available quantities. Min selectable: ${this._minSelectableCount}`);

        let firstVisibleIndex = -1;
        this._instantiatedCountItems.forEach((item, index) => {
            const isSelectable = item.countValue >= this._minSelectableCount;
            // Node is active (visible) if count is >= minimum required
            item.node.active = isSelectable;
            // Button is interactable only if it's player's turn AND count is selectable
            item.setInteractable(this._isMyTurn && isSelectable);

            if (isSelectable && firstVisibleIndex === -1) {
                firstVisibleIndex = index; // Track the first available item for scrolling
            }
        });

        // Update layout and scroll to the first available item
        this.countListContentNode.getComponent(Layout)?.updateLayout();
        this.scrollToFirstAvailableQuantity(firstVisibleIndex);
    }

    /**
     * Scrolls the quantity list to bring the first available item into view.
     * @param firstVisibleIndex Index of the first item that is active and interactable.
     */
    private scrollToFirstAvailableQuantity(firstVisibleIndex: number): void {
        if (!this.countScrollView) return;
        if (firstVisibleIndex >= 0 && this._instantiatedCountItems.length > 0) {
            // Calculate scroll percentage (approximate for grid layout)
            const percentage = firstVisibleIndex / this._instantiatedCountItems.length;
             if (this.countScrollView.vertical) {
                 this.countScrollView.scrollToPercentVertical(percentage * 100, 0.1);
             } else if (this.countScrollView.horizontal) {
                 this.countScrollView.scrollToPercentHorizontal(percentage * 100, 0.1, false);
             }
        } else {
             // If no items are available, scroll to the beginning
             if (this.countScrollView.vertical) this.countScrollView.scrollToTop(0.1);
             else if (this.countScrollView.horizontal) this.countScrollView.scrollToLeft(0.1);
        }
    }

    // --- Action Handlers ---

    /**
     * Handles the click on the main "Bid" button.
     */
    public onBidClick(): void {
        console.log(`[BidController] onBidClick triggered. Turn=${this._isMyTurn}, ButtonInteractable=${this.bidButton?.interactable}`);
        if (!this._isMyTurn || !this.bidButton?.interactable) {
            console.log("[BidController] Bid ignored: Not my turn or button not interactable.");
            return;
        }

        // Final validation before emitting
        if (!BidValidator.validFace(this._selectedBidValue) || this._selectedBidCount <= 0 ||
            !BidValidator.isBidValid(this._selectedBidValue, this._selectedBidCount, this._currentBid, this._totalDiceInGame))
        {
            console.error(`[BidController] Bid validation failed just before emitting! State: Count=${this._selectedBidCount}, Face=${this._selectedBidValue}, CurrentBid=[${this._currentBid[0]}, ${this._currentBid[1]}]`);
            this.validateAndEnableBidButton(); // Re-check and disable button if needed
            return;
        }

        // Emit the event for GameUI to handle network request
        const bid: Bid = [this._selectedBidValue, this._selectedBidCount];
        console.log(`[BidController] Emitting 'place-bid' event with bid: [${bid[0]}, ${bid[1]}]`);
        this.node.emit('place-bid', bid);

        // Disable interaction temporarily while waiting for server response
        this.disableInteractionTemporarily();
    }

    /**
     * Handles the click on the "Challenge" button.
     */
    public onChallengeClick(): void {
        if (!this._isMyTurn || !this.challengeButton?.interactable) return;
        console.log("[BidController] Emitting 'challenge' event.");
        this.node.emit('challenge');
        this.disableInteractionTemporarily();
    }

    /**
     * Handles the click on the "Spot On" button.
     */
    public onSpotOnClick(): void {
        if (!this._isMyTurn || !this.spotOnButton?.interactable) return;
        console.log("[BidController] Emitting 'spot-on' event.");
        this.node.emit('spot-on');
        this.disableInteractionTemporarily();
    }

    /**
     * Temporarily disables all interactive elements after an action is taken.
     */
    private disableInteractionTemporarily(): void {
        console.log("[BidController] Disabling interaction temporarily.");
        if(this.bidButton) this.bidButton.interactable = false;
        if(this.challengeButton) this.challengeButton.interactable = false;
        if(this.spotOnButton) this.spotOnButton.interactable = false;

        // Disable face buttons
        this._updateFaceButtons(7 as Face); // 7 disables all

        // Disable quantity buttons
        this._instantiatedCountItems.forEach(item => item.setInteractable(false));
    }

    // --- Validation & Button Enabling ---

    /**
     * Validates the current selection (quantity + face) and enables/disables the bid button accordingly.
     */
    private validateAndEnableBidButton(): void {
        if (!this.bidButton) {
            console.error("[BidController] validateAndEnableBidButton: Bid button reference is null!");
            return;
        }

        let isValid = false;
        const reason: string[] = []; // Array to store reasons for validation result

        // Check basic conditions first
        if (!this._isMyTurn) reason.push("Not player's turn");
        if (this._selectedBidCount <= 0) reason.push("Quantity not selected");
        if (!BidValidator.validFace(this._selectedBidValue)) reason.push("Face not selected or invalid");

        // Only proceed to isBidValid check if basic conditions are met
        if (this._isMyTurn && this._selectedBidCount > 0 && BidValidator.validFace(this._selectedBidValue)) {
            // Perform the actual validation against the current highest bid
            const bidCheckResult = BidValidator.isBidValid(this._selectedBidValue, this._selectedBidCount, this._currentBid, this._totalDiceInGame);
            if (!bidCheckResult) {
                reason.push(`BidValidator.isBidValid returned false for bid [${this._selectedBidValue}, ${this._selectedBidCount}] vs current [${this._currentBid[0]}, ${this._currentBid[1]}]`);
            } else {
                 reason.push(`BidValidator.isBidValid returned true for bid [${this._selectedBidValue}, ${this._selectedBidCount}] vs current [${this._currentBid[0]}, ${this._currentBid[1]}]`);
                 isValid = true; // Set isValid to true only if isBidValid passes
            }
        } else {
             // isValid remains false if basic conditions fail
             reason.push("Basic conditions failed");
        }

        this.bidButton.interactable = isValid;
        // Log detailed state and result
        console.log(`[BidController] validateAndEnableBidButton: Result=${isValid}. Reason(s): ${reason.join('; ')}. State: Turn=${this._isMyTurn}, Count=${this._selectedBidCount}, Face=${this._selectedBidValue}, CurrentBid=[${this._currentBid[0]}, ${this._currentBid[1]}]`);
    }

    // --- UI Highlighting ---

    /** Highlights the selected face value button and deselects the previous one. */
    private highlightSelectedValueButton(selectedButtonNode: Node | null): void {
        if (!this.valueSelectorNode) return;

        // Reset previous highlight
        if (this._selectedValueButtonNode && this._selectedValueButtonNode.isValid) {
             // TODO: Implement visual deselection (e.g., reset scale, color)
             this._selectedValueButtonNode.setScale(1.0, 1.0);
        }

        this._selectedValueButtonNode = selectedButtonNode;

        // Apply new highlight
        if (this._selectedValueButtonNode && this._selectedValueButtonNode.isValid) {
             // TODO: Implement visual selection (e.g., scale up, change color)
             this._selectedValueButtonNode.setScale(1.1, 1.1);
        }
    }

    /** Highlights the selected quantity list item and deselects the previous one. */
    private highlightSelectedCountItem(selectedNode: Node | null): void {
        // Reset previous highlight
        if (this._selectedCountListItemNode && this._selectedCountListItemNode.isValid) {
            const label = this._selectedCountListItemNode.getComponentInChildren(Label);
            const button = this._selectedCountListItemNode.getComponent(Button);
            if (label) {
                 // Restore color based on interactable state
                 label.color = (button && button.interactable) ? Color.WHITE : Color.GRAY;
            }
            this._selectedCountListItemNode.setScale(1.0, 1.0);
        }

        this._selectedCountListItemNode = selectedNode;

        // Apply new highlight
        if (this._selectedCountListItemNode && this._selectedCountListItemNode.isValid) {
             const label = this._selectedCountListItemNode.getComponentInChildren(Label);
             if (label) {
                 label.color = Color.YELLOW; // Highlight color
             }
             this._selectedCountListItemNode.setScale(1.1, 1.1); // Example scale highlight
        }
    }

    // --- Lifecycle ---
    onDestroy() {
        console.log("[BidController] onDestroy called.");
        // No explicit listeners on this.node to remove anymore
    }
}
