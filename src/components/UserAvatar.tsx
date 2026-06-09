export default function UserAvatar({ size = 40 }: { size?: number }) {
  return (
    <img src="/avatar.png" width={size} height={size} style={{borderRadius: '50%', objectFit: 'cover'}} alt="anonim" />
  )
}
