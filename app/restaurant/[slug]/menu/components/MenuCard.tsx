import { ItemType } from "./MenuList"

export default function MenuCard({menuItem} : {menuItem: ItemType}) {
  
  return (
    <div className=" border rounded p-3 w-[49%] mb-3">
      <h3 className="font-bold text-lg">{menuItem.name}</h3>
      <p className="font-light mt-1 text-sm">
        {menuItem.description}
      </p>
      <p className="mt-7">{menuItem.price}</p>
    </div>
  )
}