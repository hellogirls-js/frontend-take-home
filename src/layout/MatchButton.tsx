export default function MatchButton({ displayCondition, onClick }: { displayCondition: boolean; onClick: any; }) {
  return (
    <div id="match-button" className={displayCondition ? "visible" : "hidden"} onClick={() => { onClick() }}>
      Match me!
    </div>
  )
}