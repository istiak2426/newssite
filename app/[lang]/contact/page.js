export const metadata = {
  title: "যোগাযোগ - Doinik Obhimot",
  description: "আমাদের সাথে যোগাযোগ করুন",
}

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">যোগাযোগ</h1>

      <p className="mb-4">
        যেকোনো প্রশ্ন, মতামত বা সহযোগিতার জন্য আমাদের সাথে যোগাযোগ করুন।
      </p>

      <p className="mb-2"><strong>Email:</strong> doinikovimot@gmail.com</p>
      <p className="mb-2"><strong>Phone:</strong> +880168352291</p>
      <p className="mb-4"><strong>Address:</strong> Dhaka, Bangladesh</p>

      <form className="space-y-4">
        <input
          type="text"
          placeholder="আপনার নাম"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="email"
          placeholder="আপনার ইমেইল"
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          placeholder="আপনার বার্তা"
          className="w-full border px-3 py-2 rounded"
          rows="4"
        />
        <button className="bg-red-600 text-white px-4 py-2 rounded">
          পাঠান
        </button>
      </form>
    </div>
  )
}