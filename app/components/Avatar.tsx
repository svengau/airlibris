export default function Avatar({
  user,
  className,
}: {
  user: any;
  className?: string;
}) {
  if (!user) {
    return null;
  }
  return (
    <div className={`inline-block h-9 w-9 rounded-full ${className}`}>
      {user.firstName
        ? user.firstName?.[0] + user.lastName?.[0]
        : user.email[0]}
    </div>
  );
}
