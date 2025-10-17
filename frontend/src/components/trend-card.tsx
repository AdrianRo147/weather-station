import { Card, Spinner } from "@heroui/react"
import type { TrendCardProps } from "@/lib/definitions"

export const TrendCard = ({
  title,
  value,
  isLoading
}: TrendCardProps) => {
  return (
    <Card className="dark:border-default-100 border border-transparent">
      <div className="flex p-4">
        <div className="flex flex-col gap-y-2">
          <dt className="text-small text-default-500 font-medium">{title}</dt>
          <dd className="text-default-700 text-2xl font-semibold">{isLoading ? <Spinner /> : value}</dd>
        </div>
      </div>
    </Card>
  )
}
