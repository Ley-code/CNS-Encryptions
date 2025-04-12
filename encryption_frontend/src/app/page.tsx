"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Lock, Unlock } from "lucide-react"
import { postEncryptionDecryption } from "@/api/api"

export default function EncryptionTool() {
  // State for form inputs and outputs
  const [messageToEncrypt, setMessageToEncrypt] = useState("")
  const [encryptedMessage, setEncryptedMessage] = useState("")
  const [encryptionKey, setEncryptionKey] = useState("")

  const [messageToDecrypt, setMessageToDecrypt] = useState("")
  const [decryptedMessage, setDecryptedMessage] = useState("")
  const [decryptionKey, setDecryptionKey] = useState("")

  const [algorithm, setAlgorithm] = useState("OTP")
  const [isLoading, setIsLoading] = useState(false)

  // Check if key input should be shown (for non-RSA algorithms)
  const showKeyInput = algorithm !== "RSA"

  const handleEncrypt = () => {
    setIsLoading(true)
    const requestBody = {
      type_of_encryption: algorithm,
      key: showKeyInput ? encryptionKey : "", // Send key only if needed
      text: messageToEncrypt,
      task: "encrypt",
    }

    console.log(requestBody)
    postEncryptionDecryption(requestBody)
      .then((result: { result: string}) => {
        const encryptedText = result.result || ""
        setEncryptedMessage(encryptedText)
      })
      .catch((error) => console.error("Error during encryption:", error))
      .finally(() => setIsLoading(false))
  }

  const handleDecrypt = () => {
    setIsLoading(true)
    const requestBody = {
      type_of_encryption: algorithm,
      key: showKeyInput ? decryptionKey : "", // Send key only if needed
      text: messageToDecrypt,
      task: "decrypt",
    }
    postEncryptionDecryption(requestBody)
      .then((result: { result: any }) => {
        const decryptedText = result.result || ""
        setDecryptedMessage(decryptedText)
      })
      .catch((error) => console.error("Error during decryption:", error))
      .finally(() => setIsLoading(false))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-700 to-red-900 text-white py-4 rounded-lg shadow-md">
          Encryption Tool
        </h1>
        <p className="mt-4 text-muted-foreground">Secure your messages with multiple encryption algorithms</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Encryption Section */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-600" />
              Encryption
            </CardTitle>
            <CardDescription>Enter your message {showKeyInput ? "and encryption key" : ""}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="messageToEncrypt">Message to Encrypt</Label>
              <Textarea
                id="messageToEncrypt"
                placeholder="Enter your message here..."
                className="min-h-[150px] resize-none"
                value={messageToEncrypt}
                onChange={(e) => setMessageToEncrypt(e.target.value)}
              />
            </div>
            {showKeyInput && (
              <div className="space-y-2">
                <Label htmlFor="encryptionKey">Encryption Key</Label>
                <Input
                  id="encryptionKey"
                  placeholder="Enter your encryption key..."
                  value={encryptionKey}
                  onChange={(e) => setEncryptionKey(e.target.value)}
                />
              </div>
            )}
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleEncrypt}
                disabled={!messageToEncrypt || (showKeyInput && !encryptionKey) || isLoading}
              >
                {isLoading ? "Encrypting..." : "Encrypt"}
              </Button>
              <Button
                variant="outline"
                onClick={() => copyToClipboard(encryptedMessage)}
                disabled={!encryptedMessage}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="encryptedMessage">Encrypted Result</Label>
              <Textarea
                id="encryptedMessage"
                className="min-h-[100px] resize-none bg-muted"
                value={encryptedMessage}
                readOnly
                placeholder="Encrypted text will appear here..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Decryption Section */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Unlock className="h-5 w-5 text-red-600" />
              Decryption
            </CardTitle>
            <CardDescription>Enter encrypted message {showKeyInput ? "and decryption key" : ""}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="messageToDecrypt">Message to Decrypt</Label>
              <Textarea
                id="messageToDecrypt"
                placeholder="Enter encrypted message here..."
                className="min-h-[150px] resize-none"
                value={messageToDecrypt}
                onChange={(e) => setMessageToDecrypt(e.target.value)}
              />
            </div>
            {showKeyInput && (
              <div className="space-y-2">
                <Label htmlFor="decryptionKey">Decryption Key</Label>
                <Input
                  id="decryptionKey"
                  placeholder="Enter your decryption key..."
                  value={decryptionKey}
                  onChange={(e) => setDecryptionKey(e.target.value)}
                />
              </div>
            )}
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleDecrypt}
                disabled={!messageToDecrypt || (showKeyInput && !decryptionKey) || isLoading}
              >
                {isLoading ? "Decrypting..." : "Decrypt"}
              </Button>
              <Button
                variant="outline"
                onClick={() => copyToClipboard(decryptedMessage)}
                disabled={!decryptedMessage}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="decryptedMessage">Decrypted Result</Label>
              <Textarea
                id="decryptedMessage"
                className="min-h-[100px] resize-none bg-muted"
                value={decryptedMessage}
                readOnly
                placeholder="Decrypted text will appear here..."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Algorithm Selection */}
      <Card className="mt-8 shadow-md">
        <CardHeader>
          <CardTitle className="text-center">Encryption Algorithm</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={algorithm} onValueChange={setAlgorithm}>
            <SelectTrigger>
              <SelectValue placeholder="Select encryption algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OTP">One-time pad (OTP)</SelectItem>
              <SelectItem value="3DES">3DES Encryption</SelectItem>
              <SelectItem value="AES">AES Encryption</SelectItem>
              <SelectItem value="RSA">RSA Encryption</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  )
}
