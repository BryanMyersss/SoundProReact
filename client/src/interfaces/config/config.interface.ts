import CategoryInterface from "./category.interface"
import LocationInterface from "./location.interface"
import PropInterface from "./prop.interface"

export default interface ConfigInterface {
  categories: CategoryInterface[],
  locations: LocationInterface[],
  props: PropInterface[]
}