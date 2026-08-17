import { useProfileStatsQuery, useAuth } from '@/entities/user'
import { Spinner, Card } from '@/shared/ui'

export function ProfilePage() {
  const { user } = useAuth()
  const { data, isLoading, isError } = useProfileStatsQuery()

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-medium">Profil</h1>
      <p>{user?.email}</p>
      {isLoading ? (
        <Spinner label="Statistika yuklanmoqda…" />
      ) : isError ? (
        <Card>
          <p>Statistikani yuklashda xatolik yuz berdi.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <p className="text-sm opacity-70">Kurslar</p>
            <p className="text-2xl">{data?.coursesCompleted}</p>
          </Card>
          <Card>
            <p className="text-sm opacity-70">Soatlar</p>
            <p className="text-2xl">{data?.hoursLearned}</p>
          </Card>
          <Card>
            <p className="text-sm opacity-70">Streak</p>
            <p className="text-2xl">{data?.streakDays}</p>
          </Card>
        </div>
      )}
    </div>
  )
}
