System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Button, ScrollView, Prefab, instantiate, Layout, Color, CountListItem, BidValidator, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, BidController;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfCountListItem(extras) {
    _reporterNs.report("CountListItem", "../prefabs/count-list-item", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBid(extras) {
    _reporterNs.report("Bid", "../../shared/protocols/game-types.d", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFace(extras) {
    _reporterNs.report("Face", "../../shared/protocols/game-types.d", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBidValidator(extras) {
    _reporterNs.report("BidValidator", "../utils/bid-validator", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      Label = _cc.Label;
      Button = _cc.Button;
      ScrollView = _cc.ScrollView;
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
      Layout = _cc.Layout;
      Color = _cc.Color;
    }, function (_unresolved_2) {
      CountListItem = _unresolved_2.CountListItem;
    }, function (_unresolved_3) {
      BidValidator = _unresolved_3.BidValidator;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "9ca5caNZ9VCgYvWbWGnuhxq", "bid-controller", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Button', 'ScrollView', 'Prefab', 'instantiate', 'Layout', 'Color', 'Event']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BidController", BidController = (_dec = ccclass('BidController'), _dec2 = property(Button), _dec3 = property(Button), _dec4 = property(Button), _dec5 = property(Node), _dec6 = property(ScrollView), _dec7 = property(Node), _dec8 = property(Prefab), _dec9 = property(Label), _dec(_class = (_class2 = class BidController extends Component {
        constructor(...args) {
          super(...args);

          // --- UI References ---
          _initializerDefineProperty(this, "bidButton", _descriptor, this);

          _initializerDefineProperty(this, "challengeButton", _descriptor2, this);

          _initializerDefineProperty(this, "spotOnButton", _descriptor3, this);

          _initializerDefineProperty(this, "valueSelectorNode", _descriptor4, this);

          _initializerDefineProperty(this, "countScrollView", _descriptor5, this);

          _initializerDefineProperty(this, "countListContentNode", _descriptor6, this);

          _initializerDefineProperty(this, "countListItemPrefab", _descriptor7, this);

          _initializerDefineProperty(this, "currentBidLabel", _descriptor8, this);

          // --- Internal State ---
          this._currentBid = [0, 0];
          // Current highest bid
          this._selectedBidValue = 0;
          // Player's selected face value (1-6, or 0 if none)
          this._selectedBidCount = 0;
          // Player's selected quantity (0 if none)
          this._totalDiceInGame = 0;
          // Total dice currently in play
          this._isMyTurn = false;
          // Is it the current player's turn?
          this._selectedCountListItemNode = null;
          // Reference to the highlighted count item node
          this._selectedValueButtonNode = null;
          // Reference to the highlighted face value button node
          this._instantiatedCountItems = [];
          // Array to hold instantiated CountListItem components
          this._minSelectableCount = 1;
        }

        // Minimum quantity selectable based on current bid

        /**
         * Initializes the BidController.
         * @param totalDice Initial total number of dice in the game.
         */
        initialize(totalDice) {
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


        populateInitialCountItems() {
          var _this$countListConten, _this$countScrollView;

          if (!this.countListContentNode || !this.countListItemPrefab) {
            console.error("[BidController] Count list content node or item prefab not set!");
            return;
          }

          this.countListContentNode.removeAllChildren();
          this._instantiatedCountItems = [];
          console.log(`[BidController] Populating count items up to ${this._totalDiceInGame}`);

          for (let i = 1; i <= this._totalDiceInGame; i++) {
            const itemNode = instantiate(this.countListItemPrefab);
            const countListItem = itemNode.getComponent(_crd && CountListItem === void 0 ? (_reportPossibleCrUseOfCountListItem({
              error: Error()
            }), CountListItem) : CountListItem);

            if (countListItem) {
              // Pass `this` (BidController instance) as the handler target
              countListItem.setup(i, this); // CountListItem will call this.handleCountSelection

              this.countListContentNode.addChild(itemNode);

              this._instantiatedCountItems.push(countListItem);
            } else {
              console.error(`[BidController] CountListItem component not found on prefab instance for count ${i}`);
              itemNode.destroy();
            }
          } // Update layout and scroll to top


          (_this$countListConten = this.countListContentNode.getComponent(Layout)) == null || _this$countListConten.updateLayout();
          (_this$countScrollView = this.countScrollView) == null || _this$countScrollView.scrollToTop(0.1);
        }
        /**
         * Updates the controller's state based on new game state data.
         * @param isMyTurn Is it the current player's turn?
         * @param currentBid The current highest bid [face, count].
         * @param totalDiceInGame The total number of dice now in the game.
         */


        updateState(isMyTurn, currentBid, totalDiceInGame) {
          var _this$countScrollView2;

          console.log(`[BidController] updateState: Turn=${isMyTurn}, Bid=[${currentBid[0]}, ${currentBid[1]}], TotalDice=${totalDiceInGame}`);
          this._isMyTurn = isMyTurn;
          this._currentBid = currentBid; // Repopulate quantity list if total dice changed

          if (this._totalDiceInGame !== totalDiceInGame) {
            console.log(`[BidController] Total dice changed from ${this._totalDiceInGame} to ${totalDiceInGame}. Repopulating count items.`);
            this._totalDiceInGame = totalDiceInGame;
            this.populateInitialCountItems(); // This also resets count item states
          } // Always reset selections when state updates


          this.resetSelection(); // Update challenge/spot-on buttons

          const hasPreviousBid = this._currentBid[1] > 0;
          if (this.challengeButton) this.challengeButton.interactable = this._isMyTurn && hasPreviousBid;
          if (this.spotOnButton) this.spotOnButton.interactable = this._isMyTurn && hasPreviousBid; // Update the current bid display label

          this.updateCurrentBidDisplay(); // Calculate the minimum quantity the player *must* select

          const [currentValueFace, currentCount] = this._currentBid;

          if (currentCount === 0) {
            this._minSelectableCount = 1;
          } else {
            // If current bid is max possible value (1, effective value 7), must increase count
            const currentEffectiveValue = (_crd && BidValidator === void 0 ? (_reportPossibleCrUseOfBidValidator({
              error: Error()
            }), BidValidator) : BidValidator)['getEffectiveValue'](currentValueFace); // Use helper directly

            this._minSelectableCount = currentEffectiveValue === 7 ? currentCount + 1 : currentCount;
          }

          console.log(`[BidController] updateState: Minimum selectable count is ${this._minSelectableCount}`); // Update quantity buttons based on the minimum required count

          this._updateAvailableQuantities(); // Initially disable all face buttons (they get enabled after quantity selection)


          this._updateFaceButtons(7); // 7 disables all
          // Show/hide selectors based on turn


          if (this.valueSelectorNode) this.valueSelectorNode.active = this._isMyTurn;
          if ((_this$countScrollView2 = this.countScrollView) != null && _this$countScrollView2.node) this.countScrollView.node.active = this._isMyTurn; // Ensure bid button is disabled

          if (this.bidButton) this.bidButton.interactable = false; // Ensure the controller node itself is active

          this.ensureVisibility();
        }
        /**
         * Resets the player's current selection (quantity and face).
         */


        resetSelection() {
          console.log("[BidController] Resetting selection."); // Reset internal state

          this._selectedBidCount = 0;
          this._selectedBidValue = 0; // Reset UI highlights

          this.highlightSelectedCountItem(null);
          this.highlightSelectedValueButton(null); // Disable bid button

          if (this.bidButton) this.bidButton.interactable = false; // Disable all face buttons

          this._updateFaceButtons(7); // 7 disables all

        }
        /**
         * Ensures the BidController node and its parents are active.
         */


        ensureVisibility() {
          let nodeToCheck = this.node;

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


        updateCurrentBidDisplay() {
          if (!this.currentBidLabel) return;
          const [value, count] = this._currentBid;

          if (count === 0) {
            this.currentBidLabel.string = "等待首次叫价";
          } else {
            // Use BidValidator's helpers for consistency
            if ((_crd && BidValidator === void 0 ? (_reportPossibleCrUseOfBidValidator({
              error: Error()
            }), BidValidator) : BidValidator).validFace(value)) {
              this.currentBidLabel.string = `当前: ${count}个 ${(_crd && BidValidator === void 0 ? (_reportPossibleCrUseOfBidValidator({
                error: Error()
              }), BidValidator) : BidValidator).getFaceLabel(value)}`;
            } else {
              console.warn("[BidController] updateCurrentBidDisplay: Invalid face value in _currentBid:", value);
              this.currentBidLabel.string = `当前: ${count}个 ?`;
            }
          }
        } // --- Selection Handlers (New Flow: Quantity -> Face) ---

        /**
         * Handles clicks on quantity list items. Called by CountListItem instances.
         * @param detail Contains `{ count: number, node: Node }` from the clicked item.
         */


        handleCountSelection(detail) {
          if (!this._isMyTurn) return; // Ignore if not player's turn

          console.log(`[BidController] handleCountSelection: Count=${detail.count}`);

          if (!detail || typeof detail.count !== 'number' || isNaN(detail.count) || !detail.node) {
            console.error("[BidController] Invalid data from count-selected event:", detail);
            return;
          } // Update selected count and highlight


          this._selectedBidCount = detail.count;
          this.highlightSelectedCountItem(detail.node); // Reset selected face value and highlight

          this._selectedBidValue = 0;
          this.highlightSelectedValueButton(null); // Determine the minimum face value allowed for the selected quantity

          const minFace = (_crd && BidValidator === void 0 ? (_reportPossibleCrUseOfBidValidator({
            error: Error()
          }), BidValidator) : BidValidator).getMinValidFace(this._selectedBidCount, this._currentBid);
          console.log(`[BidController] Minimum valid face for count ${this._selectedBidCount} is: ${minFace}`); // Update the interactability of face buttons based on the minimum face

          this._updateFaceButtons(minFace); // Disable bid button because a face value hasn't been selected yet


          if (this.bidButton) this.bidButton.interactable = false;
        }
        /**
         * Handles clicks on face value buttons (1-6). Called via editor event binding.
         * @param event The event object.
         * @param valueString The string value ("1" to "6") associated with the button.
         */


        onValueSelect(event, valueString) {
          if (!this._isMyTurn || this._selectedBidCount === 0) return; // Must select quantity first

          console.log(`[BidController] onValueSelect: Value=${valueString}`);
          const parsedValue = parseInt(valueString);

          if ((_crd && BidValidator === void 0 ? (_reportPossibleCrUseOfBidValidator({
            error: Error()
          }), BidValidator) : BidValidator).validFace(parsedValue)) {
            this._selectedBidValue = parsedValue; // Highlight the selected button

            const targetNode = event.currentTarget;

            if (targetNode instanceof Node) {
              this.highlightSelectedValueButton(targetNode);
            } else {
              this.highlightSelectedValueButton(null);
            } // Validate if the bid button can now be enabled


            this.validateAndEnableBidButton();
          } else {
            console.warn("[BidController] Invalid face value clicked:", valueString);
          }
        } // --- UI Update Helpers ---

        /**
         * Updates the interactability of face value buttons based on the minimum allowed face.
         * @param minFace The minimum face value (1-6) allowed. Faces below this are disabled. If 7, all are disabled.
         */


        _updateFaceButtons(minFace) {
          if (!this.valueSelectorNode) return;
          this.valueSelectorNode.children.forEach(btnNode => {
            const button = btnNode.getComponent(Button); // Assuming button nodes are named like "ValueButton1", "ValueButton2", etc.

            const faceValue = parseInt(btnNode.name.replace('ValueButton', ''));

            if (button && (_crd && BidValidator === void 0 ? (_reportPossibleCrUseOfBidValidator({
              error: Error()
            }), BidValidator) : BidValidator).validFace(faceValue)) {
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


        _updateAvailableQuantities() {
          var _this$countListConten2;

          if (!this.countListContentNode) return;
          console.log(`[BidController] Updating available quantities. Min selectable: ${this._minSelectableCount}`);
          let firstVisibleIndex = -1;

          this._instantiatedCountItems.forEach((item, index) => {
            const isSelectable = item.countValue >= this._minSelectableCount; // Node is active (visible) if count is >= minimum required

            item.node.active = isSelectable; // Button is interactable only if it's player's turn AND count is selectable

            item.setInteractable(this._isMyTurn && isSelectable);

            if (isSelectable && firstVisibleIndex === -1) {
              firstVisibleIndex = index; // Track the first available item for scrolling
            }
          }); // Update layout and scroll to the first available item


          (_this$countListConten2 = this.countListContentNode.getComponent(Layout)) == null || _this$countListConten2.updateLayout();
          this.scrollToFirstAvailableQuantity(firstVisibleIndex);
        }
        /**
         * Scrolls the quantity list to bring the first available item into view.
         * @param firstVisibleIndex Index of the first item that is active and interactable.
         */


        scrollToFirstAvailableQuantity(firstVisibleIndex) {
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
            if (this.countScrollView.vertical) this.countScrollView.scrollToTop(0.1);else if (this.countScrollView.horizontal) this.countScrollView.scrollToLeft(0.1);
          }
        } // --- Action Handlers ---

        /**
         * Handles the click on the main "Bid" button.
         */


        onBidClick() {
          var _this$bidButton, _this$bidButton2;

          console.log(`[BidController] onBidClick triggered. Turn=${this._isMyTurn}, ButtonInteractable=${(_this$bidButton = this.bidButton) == null ? void 0 : _this$bidButton.interactable}`);

          if (!this._isMyTurn || !((_this$bidButton2 = this.bidButton) != null && _this$bidButton2.interactable)) {
            console.log("[BidController] Bid ignored: Not my turn or button not interactable.");
            return;
          } // Final validation before emitting


          if (!(_crd && BidValidator === void 0 ? (_reportPossibleCrUseOfBidValidator({
            error: Error()
          }), BidValidator) : BidValidator).validFace(this._selectedBidValue) || this._selectedBidCount <= 0 || !(_crd && BidValidator === void 0 ? (_reportPossibleCrUseOfBidValidator({
            error: Error()
          }), BidValidator) : BidValidator).isBidValid(this._selectedBidValue, this._selectedBidCount, this._currentBid, this._totalDiceInGame)) {
            console.error(`[BidController] Bid validation failed just before emitting! State: Count=${this._selectedBidCount}, Face=${this._selectedBidValue}, CurrentBid=[${this._currentBid[0]}, ${this._currentBid[1]}]`);
            this.validateAndEnableBidButton(); // Re-check and disable button if needed

            return;
          } // Emit the event for GameUI to handle network request


          const bid = [this._selectedBidValue, this._selectedBidCount];
          console.log(`[BidController] Emitting 'place-bid' event with bid: [${bid[0]}, ${bid[1]}]`);
          this.node.emit('place-bid', bid); // Disable interaction temporarily while waiting for server response

          this.disableInteractionTemporarily();
        }
        /**
         * Handles the click on the "Challenge" button.
         */


        onChallengeClick() {
          var _this$challengeButton;

          if (!this._isMyTurn || !((_this$challengeButton = this.challengeButton) != null && _this$challengeButton.interactable)) return;
          console.log("[BidController] Emitting 'challenge' event.");
          this.node.emit('challenge');
          this.disableInteractionTemporarily();
        }
        /**
         * Handles the click on the "Spot On" button.
         */


        onSpotOnClick() {
          var _this$spotOnButton;

          if (!this._isMyTurn || !((_this$spotOnButton = this.spotOnButton) != null && _this$spotOnButton.interactable)) return;
          console.log("[BidController] Emitting 'spot-on' event.");
          this.node.emit('spot-on');
          this.disableInteractionTemporarily();
        }
        /**
         * Temporarily disables all interactive elements after an action is taken.
         */


        disableInteractionTemporarily() {
          console.log("[BidController] Disabling interaction temporarily.");
          if (this.bidButton) this.bidButton.interactable = false;
          if (this.challengeButton) this.challengeButton.interactable = false;
          if (this.spotOnButton) this.spotOnButton.interactable = false; // Disable face buttons

          this._updateFaceButtons(7); // 7 disables all
          // Disable quantity buttons


          this._instantiatedCountItems.forEach(item => item.setInteractable(false));
        } // --- Validation & Button Enabling ---

        /**
         * Validates the current selection (quantity + face) and enables/disables the bid button accordingly.
         */


        validateAndEnableBidButton() {
          if (!this.bidButton) {
            console.error("[BidController] validateAndEnableBidButton: Bid button reference is null!");
            return;
          }

          let isValid = false;
          const reason = []; // Array to store reasons for validation result
          // Check basic conditions first

          if (!this._isMyTurn) reason.push("Not player's turn");
          if (this._selectedBidCount <= 0) reason.push("Quantity not selected");
          if (!(_crd && BidValidator === void 0 ? (_reportPossibleCrUseOfBidValidator({
            error: Error()
          }), BidValidator) : BidValidator).validFace(this._selectedBidValue)) reason.push("Face not selected or invalid"); // Only proceed to isBidValid check if basic conditions are met

          if (this._isMyTurn && this._selectedBidCount > 0 && (_crd && BidValidator === void 0 ? (_reportPossibleCrUseOfBidValidator({
            error: Error()
          }), BidValidator) : BidValidator).validFace(this._selectedBidValue)) {
            // Perform the actual validation against the current highest bid
            const bidCheckResult = (_crd && BidValidator === void 0 ? (_reportPossibleCrUseOfBidValidator({
              error: Error()
            }), BidValidator) : BidValidator).isBidValid(this._selectedBidValue, this._selectedBidCount, this._currentBid, this._totalDiceInGame);

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

          this.bidButton.interactable = isValid; // Log detailed state and result

          console.log(`[BidController] validateAndEnableBidButton: Result=${isValid}. Reason(s): ${reason.join('; ')}. State: Turn=${this._isMyTurn}, Count=${this._selectedBidCount}, Face=${this._selectedBidValue}, CurrentBid=[${this._currentBid[0]}, ${this._currentBid[1]}]`);
        } // --- UI Highlighting ---

        /** Highlights the selected face value button and deselects the previous one. */


        highlightSelectedValueButton(selectedButtonNode) {
          if (!this.valueSelectorNode) return; // Reset previous highlight

          if (this._selectedValueButtonNode && this._selectedValueButtonNode.isValid) {
            // TODO: Implement visual deselection (e.g., reset scale, color)
            this._selectedValueButtonNode.setScale(1.0, 1.0);
          }

          this._selectedValueButtonNode = selectedButtonNode; // Apply new highlight

          if (this._selectedValueButtonNode && this._selectedValueButtonNode.isValid) {
            // TODO: Implement visual selection (e.g., scale up, change color)
            this._selectedValueButtonNode.setScale(1.1, 1.1);
          }
        }
        /** Highlights the selected quantity list item and deselects the previous one. */


        highlightSelectedCountItem(selectedNode) {
          // Reset previous highlight
          if (this._selectedCountListItemNode && this._selectedCountListItemNode.isValid) {
            const label = this._selectedCountListItemNode.getComponentInChildren(Label);

            const button = this._selectedCountListItemNode.getComponent(Button);

            if (label) {
              // Restore color based on interactable state
              label.color = button && button.interactable ? Color.WHITE : Color.GRAY;
            }

            this._selectedCountListItemNode.setScale(1.0, 1.0);
          }

          this._selectedCountListItemNode = selectedNode; // Apply new highlight

          if (this._selectedCountListItemNode && this._selectedCountListItemNode.isValid) {
            const label = this._selectedCountListItemNode.getComponentInChildren(Label);

            if (label) {
              label.color = Color.YELLOW; // Highlight color
            }

            this._selectedCountListItemNode.setScale(1.1, 1.1); // Example scale highlight

          }
        } // --- Lifecycle ---


        onDestroy() {
          console.log("[BidController] onDestroy called."); // No explicit listeners on this.node to remove anymore
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "bidButton", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "challengeButton", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "spotOnButton", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "valueSelectorNode", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "countScrollView", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "countListContentNode", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "countListItemPrefab", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "currentBidLabel", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ebb27ee661c032dfe91d1cae3d081087d7695ddd.js.map