"use client"

import { useState } from "react"
import { Sidebar } from "@/components/web/sidebar"
import { Header } from "@/components/web/header"
import { HomeScreen } from "@/components/web/screens/home-screen"
import { ExploreScreen } from "@/components/web/screens/explore-screen"
import { MyExplorationsScreen } from "@/components/web/screens/my-explorations-screen"
import { MapScreen } from "@/components/web/screens/map-screen"
import { RecordScreen } from "@/components/web/screens/record-screen"
import { ProfileScreen } from "@/components/web/screens/profile-screen"
import { ExplorationDetailScreen } from "@/components/web/screens/exploration-detail-screen"
import { ExplorationIntroScreen } from "@/components/web/screens/exploration-intro-screen"
import { WriteRecordScreen } from "@/components/web/screens/write-record-screen"

interface WriteRecordData {
  explorationId: string
  explorationName: string
  explorationIcon: string
  explorationCategory: string
}

export default function HobbyQuestApp() {
  const [activeTab, setActiveTab] = useState("home")
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Demo: logged in state
  const [selectedExplorationId, setSelectedExplorationId] = useState<string | null>(null)
  const [selectedExplorationForProgress, setSelectedExplorationForProgress] = useState<string | null>(null)
  const [writeRecordData, setWriteRecordData] = useState<WriteRecordData | null>(null)

  // For intro screen (from explore menu - shows info before starting)
  const handleExplorationSelect = (id: string) => {
    setSelectedExplorationId(id)
  }

  // For progress screen (from my explorations - shows progress for ongoing exploration)
  const handleContinueExploration = (id: string) => {
    setSelectedExplorationForProgress(id)
  }

  const handleExplorationBack = () => {
    setSelectedExplorationId(null)
  }

  const handleProgressBack = () => {
    setSelectedExplorationForProgress(null)
  }

  // When user starts exploration from intro screen
  const handleStartExploration = (id: string) => {
    setSelectedExplorationId(null)
    setSelectedExplorationForProgress(id)
  }

  const handleWriteRecord = (data: WriteRecordData) => {
    setSelectedExplorationForProgress(null)
    setWriteRecordData(data)
  }

  const handleWriteRecordBack = () => {
    setWriteRecordData(null)
  }

  const handleWriteRecordSave = () => {
    setWriteRecordData(null)
    setActiveTab("record")
  }

  const renderScreen = () => {
    // If writing a record, show the write record screen
    if (writeRecordData) {
      return (
        <WriteRecordScreen
          explorationId={writeRecordData.explorationId}
          explorationName={writeRecordData.explorationName}
          explorationIcon={writeRecordData.explorationIcon}
          explorationCategory={writeRecordData.explorationCategory}
          onBack={handleWriteRecordBack}
          onSave={handleWriteRecordSave}
        />
      )
    }

    // If exploration progress is selected (from my explorations), show progress screen
    if (selectedExplorationForProgress) {
      return (
        <ExplorationDetailScreen 
          explorationId={selectedExplorationForProgress}
          onBack={handleProgressBack}
          onWriteRecord={handleWriteRecord}
        />
      )
    }

    // If exploration intro is selected (from explore menu), show intro screen
    if (selectedExplorationId) {
      return (
        <ExplorationIntroScreen 
          explorationId={selectedExplorationId}
          onBack={handleExplorationBack}
          onStart={handleStartExploration}
        />
      )
    }

    switch (activeTab) {
      case "home":
        return <HomeScreen onExplorationSelect={handleExplorationSelect} onContinueExploration={handleContinueExploration} />
      case "explore":
        return <ExploreScreen onExplorationSelect={handleExplorationSelect} />
      case "my-explorations":
        return <MyExplorationsScreen onExplorationSelect={handleContinueExploration} />
      case "map":
        return <MapScreen />
      case "record":
        return <RecordScreen onNewRecord={handleWriteRecord} />
      case "profile":
        return <ProfileScreen />
      default:
        return <HomeScreen onExplorationSelect={handleExplorationSelect} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Header */}
        <Header 
          isLoggedIn={isLoggedIn} 
          onLogin={() => setIsLoggedIn(true)}
          onLogout={() => setIsLoggedIn(false)}
        />
        
        <div className="mx-auto max-w-6xl px-8 py-8">
          {renderScreen()}
        </div>
      </main>
    </div>
  )
}
