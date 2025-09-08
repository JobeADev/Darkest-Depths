import { useState, useEffect, useRef, useContext } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CharacterContext } from "../components/contexts";
import Popup from "../components/Popup/Popup";
import "./shop.css";

export const Route = createFileRoute("/shop")({
  component: Shop,
});

function Shop() {
  const [character, setCharacter] = useContext(CharacterContext);
  const [currentHp, setCurrentHp] = useState(character[0].hp);
  const [currentMaxHp, setCurrentMaxHp] = useState(character[0].maxHp);
  const [currentGold, setCurrentGold] = useState(character[0].gold);
  const [shopInventory, setShopInventory] = useState([]);
  const [itemVisibility, setItemVisibility] = useState([]);
  const remainingItems = useRef(null);
  const [boughtItems, setBoughtItems] = useState([]);
  const [unboughtItems, setUnboughtItems] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [popupText, setPopupText] = useState("");
  const [error, setError] = useState(false);
  const healingCost = 15;
  const hpIncreaseCost = 20;

  // console.log(ShopInventory);
  // console.log(remainingItems.current);
  // console.log(unboughtItems);
  // console.log(boughtItems);

  // const handleFloorChange = () => {
  //   if ((character[1] + 1) % 16 === 0) return character[1];
  //   else return character[1] + 1;
  // };

  const handleNewPlayerInventory = () => {
    return [...character[2], ...boughtItems];
  };

  const handleNewShopInventory = () => {
    return [...remainingItems.current, ...unboughtItems];
  };

  useEffect(() => {
    if (!shopInventory.length) {
      const startingItems = [];
      const visibility = [];
      let availableShopItems = character[3];
      for (let i = 0; i < character[3].length; i++) {
        const itemIndex = Math.floor(Math.random() * availableShopItems.length);
        startingItems.push(availableShopItems[itemIndex]);
        availableShopItems = availableShopItems.filter(
          (i) => i !== availableShopItems[itemIndex],
        );
        visibility.push(true);
        if (i == 3) break;
      }
      remainingItems.current = availableShopItems;
      setShopInventory(startingItems);
      setItemVisibility(visibility);
      setUnboughtItems(startingItems);
    }
  }, []);

  const handleHeal = () => {
    setCurrentHp(currentMaxHp);
    setCurrentGold((prevGold) => prevGold - healingCost);
  };

  const handleHealthIncrease = () => {
    // if (
    //   currentHp < currentMaxHp &&
    //   currentGold > hpIncreaseCost + healingCost
    // ) {
    //   setCurrentMaxHp((prevMax) => prevMax + 5);
    //   setCurrentHp(currentMaxHp + 5);
    //   setCurrentGold((prevGold) => prevGold - (hpIncreaseCost + healingCost));
    // } else {
    setCurrentMaxHp((prevMax) => prevMax + 5);
    setCurrentHp((prevHp) => prevHp + 5);
    setCurrentGold((prevGold) => prevGold - hpIncreaseCost);
    // }
  };

  const handleItemClick = (index) => {
    if (shopInventory[index].cost <= currentGold) {
      setCurrentGold((prevGold) => prevGold - shopInventory[index].cost);
      const newVisibilityArray = [];
      for (let i = 0; i < itemVisibility.length; i++) {
        if (i == index) newVisibilityArray.push(false);
        else newVisibilityArray.push(itemVisibility[i]);
      }
      setBoughtItems((prevItems) => [...prevItems, shopInventory[index]]);
      setUnboughtItems(unboughtItems.filter((i) => i != shopInventory[index]));
      setItemVisibility(newVisibilityArray);
      setError(false);
      setPopupText("Purchased!");
      setShowPopup({ show: true });
    } else {
      setError(true);
      setPopupText("Not enough gold");
      setShowPopup({ show: true });
    }
  };

  return (
    <div className="stage-container">
      <div className="shop">
        <h1 className="current-gold">
          <span className="shop-gold-bag gold-bag" />
          {currentGold}
        </h1>
        <section className="healing-section-container">
          <section
            className={
              currentHp < currentMaxHp && currentGold >= healingCost
                ? "healing-section"
                : "healing-section disabled"
            }
            onClick={currentHp < currentMaxHp ? handleHeal : null}
          >
            <p className="healing-section-text">
              heal - <span className="shop-gold-bag-small gold-bag" />
              <span className="gold-text-coloring">{healingCost}</span>
            </p>
            <div className="healing-icon" />
            <div className="healing-section-hp">
              {currentHp} / {currentMaxHp}
            </div>
          </section>
          <section className="health-increase-section-container">
            {/* {currentHp < currentMaxHp &&
            currentGold >= hpIncreaseCost + healingCost ? (
              <div
                className={
                  currentGold >= hpIncreaseCost + healingCost
                    ? "health-increase-section"
                    : "health-increase-section disabled"
                }
                onClick={
                  currentGold >= hpIncreaseCost + healingCost
                    ? handleHealthIncrease
                    : null
                }
              >
                <p className="healing-section-text">Heal + </p>
                <p className="healing-section-text">
                  {" "}
                  Increase max hp -{" "}
                  <span className="shop-gold-bag-small gold-bag" />
                  <span className="gold-text-coloring">
                    {hpIncreaseCost + healingCost}
                  </span>
                </p>
                <div className="healing-section-hp">
                  {currentMaxHp} -{">"} {currentMaxHp + 5}
                </div>
              </div>
            ) : null} */}
            <div
              className={
                currentGold >= hpIncreaseCost
                  ? "health-increase-section"
                  : "health-increase-section disabled"
              }
              onClick={
                currentGold >= hpIncreaseCost ? handleHealthIncrease : null
              }
            >
              <p className="healing-section-text">
                Increase max hp -{" "}
                <span className="shop-gold-bag-small gold-bag" />
                <span className="gold-text-coloring">{hpIncreaseCost}</span>
              </p>
              <div className="healing-section-hp">
                {currentMaxHp} -{">"} {currentMaxHp + 5}
              </div>
            </div>
          </section>
        </section>
        <h2
          className="shop-screen-link-container"
          onClick={() =>
            character[0].isShopNext
              ? setCharacter([
                  {
                    type: character[0].type,
                    hp: currentHp,
                    maxHp: currentMaxHp,
                    gold: currentGold,
                    hasRevived: character[0].hasRevived,
                    isFloorCompleted: character[0].isFloorCompleted,
                    isShopNext: false,
                  },
                  character[1] + 1,
                  handleNewPlayerInventory(),
                  handleNewShopInventory(),
                  character[4],
                ])
              : setCharacter([
                  character[0],
                  character[1],
                  character[2],
                  character[3],
                  character[4],
                ])
          }
        >
          <Link
            to={
              (character[1] + 1) % 15 === 0 || character[1] % 15 === 0
                ? "/bossBattle"
                : "/normalBattle"
            }
            mask={
              (character[1] + 1) % 15 === 0 || character[1] % 15 === 0
                ? {
                    to: "/boss",
                  }
                : {
                    to: `/floor_${character[1] + 1}`,
                  }
            }
            className="victory-screen-link"
          >
            {(character[1] + 1) % 15 === 0 || character[1] % 15 === 0
              ? "boss fight"
              : "next fight"}
          </Link>
        </h2>
        <section className="shop-rug-container">
          <div className="shop-rug" />
          <div className="shop-items">
            {shopInventory.map((i, index) =>
              itemVisibility[index] ? (
                <div className="shop-item-container" key={i.name}>
                  <div
                    className={`shop-item ${i.shop}`}
                    onClick={() => handleItemClick(index)}
                  />
                  <p className="gold-text-coloring">
                    <span className="shop-gold-bag-small gold-bag" />
                    {i.cost}
                  </p>
                  <div className="shop-item-description">
                    <p className="shop-item-description-name">
                      {i.name}
                      {i.element != "Normal" ? (
                        <span className="icon-bg">
                          <span
                            className={`shop-item-icon ${i.element.toLowerCase()}`}
                          />
                        </span>
                      ) : null}
                    </p>
                    {i.damage ? (
                      <p>
                        damage:{" "}
                        <span className="shop-active-item-text">
                          {i.damage}
                        </span>
                      </p>
                    ) : (
                      <p>
                        effect:{" "}
                        <span className="shop-active-item-text">
                          {i.effect}
                        </span>
                      </p>
                    )}
                    {i.strong ? (
                      <p className="shop-active-item-strong-against">
                        <b className="font-change ">x</b>2 -{">"}
                        <span className={`shop-item-icon ${i.strong}`} />
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="shop-item-blank" key={i.name} />
              ),
            )}
          </div>
          {showPopup.show ? (
            <Popup
              showPopup={showPopup}
              setShowPopup={setShowPopup}
              text={popupText}
              isError={error}
              setError={setError}
            />
          ) : null}
        </section>
      </div>
    </div>
  );
}
